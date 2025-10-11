import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { UpdateSiteRequest, UpdateSiteResponse, DeleteSiteResponse } from "@/types/site"
import { createErrorResponse, createSuccessResponse, validateDomain, sanitizeDomain, ERROR_MESSAGES } from "@/lib/api-utils"

/**
 * PATCH /api/sites/[id] - Update a site
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401)
    }

    const siteId = params.id
    const body: UpdateSiteRequest = await request.json()
    const { name, domain, timezone, isPublic } = body

    // Validate that the site exists and belongs to the user
    const existingSite = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId: session.user.id,
      },
    })

    if (!existingSite) {
      return createErrorResponse(ERROR_MESSAGES.SITE_NOT_FOUND, 404)
    }

    // Validate domain if provided
    if (domain) {
      if (!validateDomain(domain)) {
        return createErrorResponse(ERROR_MESSAGES.DOMAIN_INVALID, 400)
      }

      // Check if domain already exists for another site
      const domainConflict = await prisma.site.findFirst({
        where: {
          userId: session.user.id,
          domain: sanitizeDomain(domain),
          id: { not: siteId },
        },
      })

      if (domainConflict) {
        return createErrorResponse(ERROR_MESSAGES.DOMAIN_EXISTS, 400)
      }
    }

    // Update site
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        ...(name && { name }),
        ...(domain && { domain: sanitizeDomain(domain) }),
        ...(timezone && { timezone }),
        ...(isPublic !== undefined && { isPublic }),
        updatedAt: new Date(),
      },
    })

    return createSuccessResponse<UpdateSiteResponse>({
      success: true,
      site: updatedSite,
    })
  } catch (error) {
    console.error("Update site error:", error)
    return createErrorResponse(ERROR_MESSAGES.SERVER_ERROR, 500)
  }
}

/**
 * DELETE /api/sites/[id] - Delete a site and all its data
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401)
    }

    const siteId = params.id

    // Validate that the site exists and belongs to the user
    const existingSite = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId: session.user.id,
      },
    })

    if (!existingSite) {
      return createErrorResponse(ERROR_MESSAGES.SITE_NOT_FOUND, 404)
    }

    // Delete site (cascade deletes pageviews and events)
    await prisma.site.delete({
      where: { id: siteId },
    })

    return createSuccessResponse<DeleteSiteResponse>({
      success: true,
      message: "Site deleted successfully",
    })
  } catch (error) {
    console.error("Delete site error:", error)
    return createErrorResponse(ERROR_MESSAGES.SERVER_ERROR, 500)
  }
}