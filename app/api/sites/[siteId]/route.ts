import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/sites/[siteId] - Get single site
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const params = await context.params
    const site = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        userId: session.user.id
      }
    })
    
    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ site })
  } catch (error) {
    console.error("Error fetching site:", error)
    return NextResponse.json(
      { error: "Failed to fetch site" },
      { status: 500 }
    )
  }
}

// PATCH /api/sites/[siteId] - Update site
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const params = await context.params
    // Verify site ownership
    const existingSite = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        userId: session.user.id
      }
    })
    
    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    const { name, domain, timezone, isPublic } = body
    
    // Validate domain format if provided
    if (domain) {
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
      if (!domainRegex.test(domain)) {
        return NextResponse.json(
          { error: "Invalid domain format" },
          { status: 400 }
        )
      }
    }
    
    // Update site
    const site = await prisma.site.update({
      where: {
        id: params.siteId
      },
      data: {
        ...(name && { name }),
        ...(domain && { domain }),
        ...(timezone && { timezone }),
        ...(typeof isPublic === "boolean" && { isPublic }),
      }
    })
    
    return NextResponse.json({
      site,
      message: "Site updated successfully"
    })
  } catch (error) {
    console.error("Error updating site:", error)
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 }
    )
  }
}

// DELETE /api/sites/[siteId] - Delete site
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const params = await context.params
    // Verify site ownership
    const existingSite = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        userId: session.user.id
      }
    })
    
    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      )
    }
    
    // Delete site (cascades to pageviews and events via Prisma schema)
    await prisma.site.delete({
      where: {
        id: params.siteId
      }
    })
    
    return NextResponse.json({
      message: "Site deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 }
    )
  }
}

