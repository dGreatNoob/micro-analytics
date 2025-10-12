import { NextRequest } from "next/server"
import { UAParser } from "ua-parser-js"

/**
 * User-Agent Parsing
 * Extract device, browser, and OS information from user-agent string
 */
export interface ParsedUserAgent {
  device: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  return {
    device: getDeviceType(result),
    browser: result.browser.name || "Unknown",
    browserVersion: result.browser.version || "Unknown",
    os: result.os.name || "Unknown",
    osVersion: result.os.version || "Unknown",
  }
}

/**
 * Determine device type from UA parser result
 */
function getDeviceType(result: ReturnType<UAParser["getResult"]>): string {
  if (result.device.type === "mobile") return "Mobile"
  if (result.device.type === "tablet") return "Tablet"
  if (result.device.type === "wearable") return "Wearable"
  if (result.device.type === "console") return "Console"
  if (result.device.type === "smarttv") return "Smart TV"
  
  // Desktop is default if no device type is specified
  return "Desktop"
}

/**
 * IP Address Extraction and Masking
 * Extract IP from request headers and mask for privacy
 */
export interface IPInfo {
  original: string
  masked: string
}

export function extractIP(request: NextRequest): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip") // Cloudflare
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  // Fallback to localhost (request.ip might not be available)
  return "127.0.0.1"
}

/**
 * Mask IP address for privacy
 * Removes last octet (IPv4) or last 4 groups (IPv6)
 */
export function maskIP(ip: string): string {
  if (!ip) return "0.0.0.0"
  
  // Check if IPv6
  if (ip.includes(":")) {
    // IPv6: Keep first 4 groups, mask the rest
    const groups = ip.split(":")
    if (groups.length > 4) {
      return groups.slice(0, 4).join(":") + ":0:0:0:0"
    }
    return ip // If less than 4 groups, return as is
  }
  
  // IPv4: Remove last octet
  const octets = ip.split(".")
  if (octets.length === 4) {
    return `${octets[0]}.${octets[1]}.${octets[2]}.0`
  }
  
  return ip // If invalid format, return as is
}

/**
 * IP Geolocation (Basic Country Detection)
 * For Phase 5, we'll use a simple approach based on IP ranges
 * In Phase 7, this can be enhanced with a proper geolocation service
 */
export interface GeoLocation {
  country: string | null
  countryCode: string | null
}

export function getCountryFromIP(ip: string): GeoLocation {
  // For MVP Phase 5: Return null (will implement in Phase 7 with proper service)
  // This is a placeholder that allows the system to work without breaking
  
  // In Phase 7, you can integrate:
  // - MaxMind GeoLite2 (free, needs download)
  // - ipapi.co API
  // - ipinfo.io API
  // - CloudFlare headers (if using CloudFlare)
  
  // For now, check if it's localhost
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return {
      country: "Local",
      countryCode: "LOCAL",
    }
  }
  
  // Return null for Phase 5 (will show as null in database)
  return {
    country: null,
    countryCode: null,
  }
}

/**
 * Rate Limiting (Simple In-Memory Implementation)
 * Track requests per IP to prevent abuse
 */
interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (will reset on server restart)
// For production, use Redis or a proper rate limiting service
const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
}

export function checkRateLimit(
  identifier: string,
  limit: number = 100, // 100 requests
  windowMs: number = 60000 // per 60 seconds (1 minute)
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  // Clean up expired entries every 1000 checks
  if (Math.random() < 0.001) {
    cleanupRateLimitStore(now)
  }
  
  if (!entry || entry.resetAt < now) {
    // No entry or expired - create new
    const resetAt = now + windowMs
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    })
    
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetAt,
    }
  }
  
  // Entry exists and not expired
  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(identifier, entry)
  
  return {
    allowed: true,
    limit,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimitStore(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Validate pageview data
 * Ensure required fields are present and valid
 */
export interface PageviewData {
  siteId: string
  pathname: string
  hostname: string
  referrer: string | null
  userAgent: string
  language?: string
  screenWidth?: number
  screenHeight?: number
  timestamp: string
  visitorId: string
}

export function validatePageviewData(data: any): data is PageviewData {
  if (!data) return false
  if (typeof data.siteId !== "string" || !data.siteId) return false
  if (typeof data.pathname !== "string" || !data.pathname) return false
  if (typeof data.hostname !== "string" || !data.hostname) return false
  if (typeof data.userAgent !== "string" || !data.userAgent) return false
  if (typeof data.visitorId !== "string" || !data.visitorId) return false
  if (typeof data.timestamp !== "string" || !data.timestamp) return false
  
  return true
}

/**
 * Generate unique pageview ID
 * Uses timestamp + random string for uniqueness
 */
export function generatePageviewId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 15)
  return `pv_${timestamp}_${random}`
}

