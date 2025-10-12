import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  parseUserAgent,
  extractIP,
  maskIP,
  getCountryFromIP,
  checkRateLimit,
  validatePageviewData,
  generatePageviewId,
  type PageviewData,
} from "@/lib/tracking-utils"

/**
 * POST /api/track - Track pageview or event
 * 
 * Phase 5: Full implementation with:
 * - Database storage (PostgreSQL via Prisma)
 * - User-Agent parsing (device, browser, OS)
 * - IP masking for privacy
 * - Rate limiting (100 req/min per IP)
 * - Site validation
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Extract IP for rate limiting
    const clientIP = extractIP(request)
    
    // Step 2: Check rate limit (100 requests per minute per IP)
    const rateLimit = checkRateLimit(clientIP, 100, 60000)
    
    if (!rateLimit.allowed) {
      console.warn(`[Tracking] Rate limit exceeded for IP: ${maskIP(clientIP)}`)
      
      return NextResponse.json(
        { 
          success: false,
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.resetAt.toString(),
            "Retry-After": Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
          }
        }
      )
    }

    // Step 3: Parse request body
    const data = await request.json() as Partial<PageviewData>

    // Step 4: Validate required fields
    if (!validatePageviewData(data)) {
      return NextResponse.json(
        { success: false, error: "Invalid pageview data" },
        { status: 400 }
      )
    }

    // Step 5: Validate siteId exists in database
    const site = await prisma.site.findUnique({
      where: { siteId: data.siteId },
      select: { id: true, siteId: true, name: true, domain: true }
    })

    if (!site) {
      console.warn(`[Tracking] Invalid site ID: ${data.siteId}`)
      return NextResponse.json(
        { success: false, error: "Invalid site ID" },
        { status: 404 }
      )
    }

    // Step 6: Parse User-Agent
    const parsedUA = parseUserAgent(data.userAgent)

    // Step 7: Process IP address
    const maskedIP = maskIP(clientIP)
    const geoLocation = getCountryFromIP(clientIP)

    // Step 8: Store pageview in database
    const pageview = await prisma.pageview.create({
      data: {
        id: generatePageviewId(),
        siteId: site.id,
        pathname: data.pathname,
        referrer: data.referrer || null,
        visitorId: data.visitorId,
        device: parsedUA.device,
        browser: parsedUA.browser,
        os: parsedUA.os,
        country: geoLocation.countryCode,
        timestamp: new Date(data.timestamp),
      }
    })

    // Step 9: Log successful tracking (dev mode)
    if (process.env.NODE_ENV === "development") {
      const readableTime = new Date(data.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('✅ [Tracking] Pageview Stored in Database')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🆔 Site:       ', site.name, `(${site.siteId})`)
      console.log('📄 Page:       ', data.pathname)
      console.log('🔗 Referrer:   ', data.referrer || '(direct)')
      console.log('👤 Visitor:    ', data.visitorId.substring(0, 12) + '...')
      console.log('💻 Device:     ', parsedUA.device)
      console.log('🌐 Browser:    ', `${parsedUA.browser} ${parsedUA.browserVersion}`)
      console.log('🖥️  OS:         ', `${parsedUA.os} ${parsedUA.osVersion}`)
      console.log('🌍 Country:    ', geoLocation.country || '(unknown)')
      console.log('📍 IP:         ', maskedIP, '(masked)')
      console.log('🕐 Time:       ', readableTime)
      console.log('🔢 DB ID:      ', pageview.id)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    }

    // Step 10: Return success
    return NextResponse.json(
      { success: true, id: pageview.id },
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        }
      }
    )
  } catch (error) {
    // Step 11: Error handling
    console.error('[Tracking] Error processing request:', error)
    
    // Always return 200 to avoid breaking tracking script
    // Log error but don't expose details to client
    return NextResponse.json(
      { success: true }, // Return success to avoid breaking tracking
      { status: 200 }
    )
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
      }
    }
  )
}
