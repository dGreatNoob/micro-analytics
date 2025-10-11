import { Site } from "@prisma/client"

// Base Site type from Prisma
export type { Site }

// API Request/Response types
export interface CreateSiteRequest {
  name: string
  domain: string
  timezone?: string
}

export interface UpdateSiteRequest {
  name?: string
  domain?: string
  timezone?: string
  isPublic?: boolean
}

export interface CreateSiteResponse {
  success: true
  site: Site
}

export interface UpdateSiteResponse {
  success: true
  site: Site
}

export interface DeleteSiteResponse {
  success: true
  message: string
}

export interface GetSitesResponse {
  success: true
  sites: Site[]
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: string
}

// Dashboard component props
export interface SiteCardProps {
  site: Site
  onEdit: (site: Site) => void
  onDelete: (site: Site) => void
}

export interface SiteFormProps {
  site?: Site
  onSubmit: (data: CreateSiteRequest | UpdateSiteRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

// Validation schemas
export interface SiteValidationErrors {
  name?: string
  domain?: string
  timezone?: string
}

// Tracking script data
export interface TrackingScriptData {
  siteId: string
  domain: string
  scriptUrl: string
}