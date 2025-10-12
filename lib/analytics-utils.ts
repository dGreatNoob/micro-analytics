import { subDays, startOfDay, endOfDay } from "date-fns"

/**
 * Analytics Utility Functions
 * Helper functions for date ranges, aggregations, and data processing
 */

/**
 * Date Range Helper
 * Get start and end dates for common time periods
 */
export interface DateRange {
  start: Date
  end: Date
}

export function getDateRange(days: number): DateRange {
  const end = endOfDay(new Date())
  const start = startOfDay(subDays(end, days - 1))
  
  return { start, end }
}

/**
 * Parse date range from query parameters
 */
export function parseDateRangeFromQuery(
  startParam?: string | null,
  endParam?: string | null,
  defaultDays: number = 7
): DateRange {
  if (startParam && endParam) {
    return {
      start: new Date(startParam),
      end: new Date(endParam)
    }
  }
  
  return getDateRange(defaultDays)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100 * 10) / 10 // Round to 1 decimal
}

/**
 * Calculate bounce rate
 * A "bounce" is when a visitor views only one page
 */
export function calculateBounceRate(
  totalSessions: number,
  bouncedSessions: number
): number {
  if (totalSessions === 0) return 0
  return formatPercentage(bouncedSessions, totalSessions)
}

/**
 * Calculate average time on page
 * Returns average duration in seconds
 */
export function calculateAverageTime(
  totalDuration: number,
  count: number
): number {
  if (count === 0) return 0
  return Math.round(totalDuration / count)
}

/**
 * Format duration for display (e.g., "2m 34s")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (remainingSeconds === 0) {
    return `${minutes}m`
  }
  
  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Calculate growth percentage between two values
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

/**
 * Group pageviews by date for chart data
 */
export interface ChartDataPoint {
  date: string
  visits: number
}

export function groupPageviewsByDate(
  pageviews: Array<{ timestamp: Date }>,
  dateRange: DateRange
): ChartDataPoint[] {
  // Create map of all dates in range
  const dateMap = new Map<string, number>()
  const current = new Date(dateRange.start)
  
  while (current <= dateRange.end) {
    const dateKey = current.toISOString().split('T')[0]
    dateMap.set(dateKey, 0)
    current.setDate(current.getDate() + 1)
  }
  
  // Count pageviews per date
  pageviews.forEach(pv => {
    const dateKey = pv.timestamp.toISOString().split('T')[0]
    if (dateMap.has(dateKey)) {
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1)
    }
  })
  
  // Convert to array and format
  return Array.from(dateMap.entries())
    .map(([date, visits]) => ({
      date: formatChartDate(date),
      visits
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Format date for chart display
 */
function formatChartDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}

/**
 * Validate siteId parameter
 */
export function validateSiteId(siteId: string | null | undefined): boolean {
  if (!siteId || typeof siteId !== 'string') return false
  if (siteId.length < 10) return false // Reasonable minimum length
  return true
}

/**
 * Calculate unique visitors from pageviews
 */
export function countUniqueVisitors(pageviews: Array<{ visitorId: string }>): number {
  const uniqueVisitors = new Set(pageviews.map(pv => pv.visitorId))
  return uniqueVisitors.size
}

/**
 * Safe parseInt for query parameters
 */
export function parseIntParam(param: string | null | undefined, defaultValue: number): number {
  if (!param) return defaultValue
  const parsed = parseInt(param, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

