import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseDateRangeFromQuery, calculateGrowth, countUniqueVisitors } from "@/lib/analytics-utils"

/**
 * GET /api/analytics/overview
 * Returns overview statistics for a site
 * 
 * Query params:
 * - siteId: Site ID (required)
 * - start: Start date (optional, defaults to 7 days ago)
 * - end: End date (optional, defaults to today)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const siteId = searchParams.get("siteId")

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      )
    }

    // Verify site ownership
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId: session.user.id
      }
    })

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      )
    }

    // Parse date range from timeRange parameter
    const timeRange = searchParams.get("timeRange") || "7d"
    const days = timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 7
    
    const dateRange = parseDateRangeFromQuery(
      searchParams.get("start"),
      searchParams.get("end"),
      days
    )

    // Get current period pageviews
    const currentPageviews = await prisma.pageview.findMany({
      where: {
        siteId: site.id,
        timestamp: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      select: {
        id: true,
        visitorId: true,
        duration: true,
        pathname: true,
        timestamp: true
      }
    })

    // Get previous period for comparison (same length of time, before current period)
    const periodLength = dateRange.end.getTime() - dateRange.start.getTime()
    const previousStart = new Date(dateRange.start.getTime() - periodLength)
    const previousEnd = new Date(dateRange.start.getTime())

    const previousPageviews = await prisma.pageview.findMany({
      where: {
        siteId: site.id,
        timestamp: {
          gte: previousStart,
          lt: previousEnd
        }
      },
      select: {
        id: true,
        visitorId: true
      }
    })

    // Calculate metrics
    const totalPageviews = currentPageviews.length
    const uniqueVisitors = countUniqueVisitors(currentPageviews)
    
    const previousTotalPageviews = previousPageviews.length
    const previousUniqueVisitors = countUniqueVisitors(previousPageviews)

    // Calculate average time on page (from duration field)
    const pageviewsWithDuration = currentPageviews.filter(pv => pv.duration)
    const totalDuration = pageviewsWithDuration.reduce((sum, pv) => sum + (pv.duration || 0), 0)
    const avgTimeOnPage = pageviewsWithDuration.length > 0 
      ? Math.round(totalDuration / pageviewsWithDuration.length)
      : 0

    // Calculate bounce rate (visitors with only 1 pageview)
    const visitorPageviewCounts = new Map<string, number>()
    currentPageviews.forEach(pv => {
      visitorPageviewCounts.set(
        pv.visitorId,
        (visitorPageviewCounts.get(pv.visitorId) || 0) + 1
      )
    })
    
    const bouncedVisitors = Array.from(visitorPageviewCounts.values())
      .filter(count => count === 1).length
    const bounceRate = uniqueVisitors > 0 
      ? Math.round((bouncedVisitors / uniqueVisitors) * 100 * 10) / 10
      : 0

    // Calculate growth percentages
    const pageviewGrowth = calculateGrowth(totalPageviews, previousTotalPageviews)
    const visitorGrowth = calculateGrowth(uniqueVisitors, previousUniqueVisitors)

    // Get top pages
    const pageGroups = new Map<string, { views: number; visitors: Set<string> }>()
    currentPageviews.forEach(pv => {
      if (!pageGroups.has(pv.pathname)) {
        pageGroups.set(pv.pathname, { views: 0, visitors: new Set() })
      }
      const group = pageGroups.get(pv.pathname)!
      group.views++
      group.visitors.add(pv.visitorId)
    })

    const topPages = Array.from(pageGroups.entries())
      .map(([pathname, data]) => ({
        pathname,
        views: data.views,
        uniqueVisitors: data.visitors.size
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Get top referrers
    const referrerData = await prisma.pageview.findMany({
      where: {
        siteId: site.id,
        timestamp: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      select: {
        referrer: true,
        visitorId: true
      }
    })

    const referrerGroups = new Map<string, { visitors: Set<string>; pageviews: number }>()
    referrerData.forEach(pv => {
      const ref = pv.referrer || "(direct)"
      if (!referrerGroups.has(ref)) {
        referrerGroups.set(ref, { visitors: new Set(), pageviews: 0 })
      }
      const group = referrerGroups.get(ref)!
      group.visitors.add(pv.visitorId)
      group.pageviews++
    })

    const topReferrers = Array.from(referrerGroups.entries())
      .map(([referrer, data]) => ({
        referrer,
        visitors: data.visitors.size,
        pageviews: data.pageviews
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10)

    // Return overview data (flat structure expected by frontend)
    return NextResponse.json({
      totalPageviews,
      uniqueVisitors,
      avgSessionDuration: avgTimeOnPage, // Frontend expects this name
      bounceRate,
      topPages,
      topReferrers
    })
  } catch (error) {
    console.error("[Analytics] Overview error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

