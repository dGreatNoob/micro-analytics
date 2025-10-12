import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseDateRangeFromQuery, countUniqueVisitors } from "@/lib/analytics-utils"

/**
 * GET /api/analytics/pages
 * Returns top pages with views and unique visitors
 * 
 * Query params:
 * - siteId: Site ID (required)
 * - start: Start date (optional)
 * - end: End date (optional)
 * - limit: Number of results (optional, default 10)
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

    const searchParams = request.nextUrl.searchParams
    const siteId = searchParams.get("siteId")
    const limit = parseInt(searchParams.get("limit") || "10", 10)

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

    // Parse date range
    const dateRange = parseDateRangeFromQuery(
      searchParams.get("start"),
      searchParams.get("end"),
      7
    )

    // Get all pageviews in date range
    const pageviews = await prisma.pageview.findMany({
      where: {
        siteId: site.id,
        timestamp: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      select: {
        pathname: true,
        visitorId: true
      }
    })

    // Group by pathname and calculate stats
    const pageStats = new Map<string, { views: number, visitors: Set<string> }>()
    
    pageviews.forEach(pv => {
      if (!pageStats.has(pv.pathname)) {
        pageStats.set(pv.pathname, {
          views: 0,
          visitors: new Set()
        })
      }
      
      const stats = pageStats.get(pv.pathname)!
      stats.views++
      stats.visitors.add(pv.visitorId)
    })

    // Convert to array and sort by views
    const topPages = Array.from(pageStats.entries())
      .map(([pathname, stats]) => ({
        page: pathname,
        views: stats.views,
        visitors: stats.visitors.size
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: topPages,
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      }
    })
  } catch (error) {
    console.error("[Analytics] Pages error:", error)
    return NextResponse.json(
      { error: "Failed to fetch page analytics" },
      { status: 500 }
    )
  }
}

