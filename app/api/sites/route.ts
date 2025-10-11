import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { createId } from "@paralleldrive/cuid2"
import { CreateSiteRequest, GetSitesResponse } from "@/types/site"
import { createErrorResponse, createSuccessResponse, validateDomain, sanitizeDomain, ERROR_MESSAGES } from "@/lib/api-utils"

/**
 * GET /api/sites - Get all sites for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401)
    }

    const sites = await prisma.site.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return createSuccessResponse<GetSitesResponse>({
      success: true,
      sites,
    })
  } catch (error) {
    console.error("Get sites error:", error)
    return createErrorResponse(ERROR_MESSAGES.SERVER_ERROR, 500)
  }
}

/**
 * POST /api/sites - Create a new site
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401)
    }

    const body: CreateSiteRequest = await request.json()
    const { name, domain, timezone = "UTC" } = body

    // Validate input
    if (!name || !domain) {
      return createErrorResponse(ERROR_MESSAGES.MISSING_FIELDS, 400)
    }

    // Domain validation
    if (!validateDomain(domain)) {
      return createErrorResponse(ERROR_MESSAGES.DOMAIN_INVALID, 400)
    }

    // Check if domain already exists for this user
    const existingSite = await prisma.site.findFirst({
      where: {
        userId: session.user.id,
        domain: sanitizeDomain(domain),
      },
    })

    if (existingSite) {
      return createErrorResponse(ERROR_MESSAGES.DOMAIN_EXISTS, 400)
    }

    // Generate unique site ID
    const siteId = createId()

    // Create site
    const site = await prisma.site.create({
      data: {
        id: createId(),
        userId: session.user.id,
        name,
        domain: sanitizeDomain(domain),
        siteId,
        timezone,
        updatedAt: new Date(),
      },
    })

    return createSuccessResponse(
      {
        success: true,
        site,
      },
      201
    )
  } catch (error) {
    console.error("Create site error:", error)
    return createErrorResponse(ERROR_MESSAGES.SERVER_ERROR, 500)
  }
}