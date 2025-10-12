import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/track - Track pageview or event
 * 
 * Phase 4: Basic endpoint that validates and logs data
 * Phase 5: Will add full implementation with:
 *  - Database storage (Pageview/Event models)
 *  - User-Agent parsing (device, browser, OS)
 *  - IP geolocation (country)
 *  - Rate limiting
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const data = await request.json()

    // Basic validation
    if (!data.siteId) {
      return NextResponse.json(
        { error: "Missing siteId" },
        { status: 400 }
      )
    }

    if (!data.pathname) {
      return NextResponse.json(
        { error: "Missing pathname" },
        { status: 400 }
      )
    }

    // Log received data (Phase 4 - for testing)
    const readableTime = new Date(data.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 [Tracking] Pageview Received')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🆔 Site ID:    ', data.siteId)
    console.log('📄 Page:       ', data.pathname)
    console.log('🔗 Referrer:   ', data.referrer || '(direct)')
    console.log('👤 Visitor ID: ', data.visitorId)
    console.log('🕐 Time:       ', readableTime)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // TODO Phase 5: Validate siteId exists in database
    // TODO Phase 5: Parse User-Agent for device/browser/OS
    // TODO Phase 5: Extract country from IP address
    // TODO Phase 5: Store in Pageview table
    // TODO Phase 5: Add rate limiting

    // Return success (fast response)
    return NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('[Tracking] Error processing request:', error)
    
    // Return success even on error (don't break tracking script)
    return NextResponse.json(
      { success: true },
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
      }
    }
  )
}


