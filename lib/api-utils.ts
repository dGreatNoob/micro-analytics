import { NextResponse } from "next/server"
import { ApiErrorResponse } from "@/types/site"

/**
 * Standardized API error response helper
 */
export function createErrorResponse(
  error: string,
  status: number = 500,
  details?: string
): NextResponse<ApiErrorResponse> {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
      ...(details && { details }),
    },
    { status }
  )
}

/**
 * Standardized API success response helper
 */
export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Validate domain format
 * Allows standard domains (example.com) and localhost for testing
 */
export function validateDomain(domain: string): boolean {
  // Allow localhost for testing
  if (domain.toLowerCase() === 'localhost') {
    return true
  }
  
  // Allow localhost with port
  if (domain.toLowerCase().startsWith('localhost:')) {
    return true
  }
  
  // Standard domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

/**
 * Sanitize domain (lowercase, trim)
 */
export function sanitizeDomain(domain: string): string {
  return domain.toLowerCase().trim()
}

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "Not found",
  VALIDATION_ERROR: "Validation error",
  SERVER_ERROR: "Internal server error",
  DOMAIN_INVALID: "Invalid domain format",
  DOMAIN_EXISTS: "A site with this domain already exists",
  SITE_NOT_FOUND: "Site not found",
  MISSING_FIELDS: "Missing required fields",
} as const