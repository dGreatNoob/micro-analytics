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
        siteId: siteId,
        userId: session.user.id
      }
    })

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      )
    }

    // Parse date range
    const dateRange = parseDateRangeFromQuery(
      searchParams.get("start"),
      searchParams.get("end"),
      7 // Default to last 7 days
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

    // Return overview data
    return NextResponse.json({
      success: true,
      data: {
        totalPageviews,
        uniqueVisitors,
        avgTimeOnPage, // in seconds
        bounceRate, // percentage
        growth: {
          pageviews: pageviewGrowth,
          visitors: visitorGrowth
        },
        dateRange: {
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString()
        }
      }
    })
  } catch (error) {
    console.error("[Analytics] Overview error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

