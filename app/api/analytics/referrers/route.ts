import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseDateRangeFromQuery, formatPercentage } from "@/lib/analytics-utils"

/**
 * GET /api/analytics/referrers
 * Returns top referrers (traffic sources)
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
      7
    )

    // Get pageviews with referrers
    const pageviews = await prisma.pageview.findMany({
      where: {
        siteId: site.id,
        timestamp: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      select: {
        referrer: true
      }
    })

    // Group by referrer
    const referrerCounts = new Map<string, number>()
    
    pageviews.forEach(pv => {
      const referrer = pv.referrer || "(direct)"
      referrerCounts.set(referrer, (referrerCounts.get(referrer) || 0) + 1)
    })

    const totalPageviews = pageviews.length

    // Convert to array and calculate percentages
    const topReferrers = Array.from(referrerCounts.entries())
      .map(([source, visits]) => ({
        source,
        visits,
        percentage: formatPercentage(visits, totalPageviews)
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: topReferrers,
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      }
    })
  } catch (error) {
    console.error("[Analytics] Referrers error:", error)
    return NextResponse.json(
      { error: "Failed to fetch referrer analytics" },
      { status: 500 }
    )
  }
}

