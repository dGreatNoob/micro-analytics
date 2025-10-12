import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseDateRangeFromQuery, formatPercentage } from "@/lib/analytics-utils"

/**
 * GET /api/analytics/devices
 * Returns device, browser, and OS breakdown
 * 
 * Query params:
 * - siteId: Site ID (required)
 * - start: Start date (optional)
 * - end: End date (optional)
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

    // Get pageviews with device info
    const pageviews = await prisma.pageview.findMany({
      where: {
        siteId: site.id,
        timestamp: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      select: {
        device: true,
        browser: true,
        os: true
      }
    })

    const totalPageviews = pageviews.length

    // Group by device
    const deviceCounts = new Map<string, number>()
    pageviews.forEach(pv => {
      const device = pv.device || "Unknown"
      deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1)
    })

    const devices = Array.from(deviceCounts.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: formatPercentage(value, totalPageviews)
      }))
      .sort((a, b) => b.value - a.value)

    // Group by browser
    const browserCounts = new Map<string, number>()
    pageviews.forEach(pv => {
      const browser = pv.browser || "Unknown"
      browserCounts.set(browser, (browserCounts.get(browser) || 0) + 1)
    })

    const browsers = Array.from(browserCounts.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: formatPercentage(value, totalPageviews)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10 browsers

    // Group by OS
    const osCounts = new Map<string, number>()
    pageviews.forEach(pv => {
      const os = pv.os || "Unknown"
      osCounts.set(os, (osCounts.get(os) || 0) + 1)
    })

    const operatingSystems = Array.from(osCounts.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: formatPercentage(value, totalPageviews)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10 OS

    return NextResponse.json({
      success: true,
      data: {
        devices,
        browsers,
        operatingSystems
      },
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      }
    })
  } catch (error) {
    console.error("[Analytics] Devices error:", error)
    return NextResponse.json(
      { error: "Failed to fetch device analytics" },
      { status: 500 }
    )
  }
}

