import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createId } from "@paralleldrive/cuid2"

// GET /api/sites - List all sites for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const sites = await prisma.site.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        name: true,
        domain: true,
        siteId: true,
        timezone: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    
    return NextResponse.json({ sites })
  } catch (error) {
    console.error("Error fetching sites:", error)
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    )
  }
}

// POST /api/sites - Create new site
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { name, domain, timezone } = body
    
    // Validate required fields
    if (!name || !domain) {
      return NextResponse.json(
        { error: "Name and domain are required" },
        { status: 400 }
      )
    }
    
    // Validate domain format (basic validation)
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      )
    }
    
    // Generate unique site ID
    const siteId = createId()
    
    // Create site in database
    const site = await prisma.site.create({
      data: {
        name,
        domain,
        siteId,
        timezone: timezone || "UTC",
        userId: session.user.id,
      }
    })
    
    return NextResponse.json(
      { 
        site,
        message: "Site created successfully"
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating site:", error)
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    )
  }
}

