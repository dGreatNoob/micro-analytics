"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, ArrowLeft, Save, Trash2, ExternalLink } from "lucide-react"
import { Site, UpdateSiteRequest, ApiErrorResponse } from "@/types/site"

export default function SiteDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const siteId = params.id as string

  const [site, setSite] = useState<Site | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    timezone: "UTC",
    isPublic: false,
  })

  // Load site data
  useEffect(() => {
    if (siteId) {
      loadSite()
    }
  }, [siteId])

  const loadSite = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/sites")
      const data = await response.json()

      if (data.success) {
        const foundSite = data.sites.find((s: Site) => s.id === siteId)
        if (foundSite) {
          setSite(foundSite)
          setFormData({
            name: foundSite.name,
            domain: foundSite.domain,
            timezone: foundSite.timezone,
            isPublic: foundSite.isPublic,
          })
        } else {
          setError("Site not found")
        }
      } else {
        setError(data.error || "Failed to load site")
      }
    } catch (err) {
      setError("Failed to load site")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!site) return

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSite(data.site)
        setIsEditing(false)
      } else {
        setError(data.error || "Failed to update site")
      }
    } catch (err) {
      setError("Failed to update site")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!site) return

    if (!confirm(`Are you sure you want to delete "${site.name}"? This will permanently delete all analytics data for this site.`)) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        router.push("/dashboard/sites")
      } else {
        setError(data.error || "Failed to delete site")
      }
    } catch (err) {
      setError("Failed to delete site")
    } finally {
      setIsDeleting(false)
    }
  }

  const copyTrackingScript = () => {
    if (!site) return
    const script = getTrackingScript()
    navigator.clipboard.writeText(script)
  }

  const getTrackingScript = () => {
    if (!site) return ""
    return `<script async defer src="${window.location.origin}/m.js" data-site="${site.siteId}"></script>`
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Site Not Found</h1>
          <p className="text-sm text-muted-foreground mt-1">The requested site could not be found.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/sites")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sites
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/sites")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{site.name}</h1>
            <p className="text-sm text-muted-foreground">{site.domain}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    name: site.name,
                    domain: site.domain,
                    timezone: site.timezone,
                    isPublic: site.isPublic,
                  })
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Site
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Settings */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Site Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                disabled={!isEditing}
                className="rounded"
              />
              <Label htmlFor="isPublic">Public site (visible to others)</Label>
            </div>
          </div>
        </Card>

        {/* Tracking Script */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Tracking Script</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Site ID</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-muted px-3 py-2 rounded font-mono flex-1">
                  {site.siteId}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigator.clipboard.writeText(site.siteId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Installation Code</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Add this script to your website&apos;s <code>&lt;head&gt;</code> section
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground">
                  {getTrackingScript()}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={copyTrackingScript}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="p-6 bg-card border-destructive/50 shadow-sm">
        <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete this site and all its analytics data. This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Site"}
        </Button>
      </Card>
    </div>
  )
}