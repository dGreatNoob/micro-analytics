"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Trash2, ExternalLink, Copy } from "lucide-react"
import { Site, CreateSiteRequest, ApiErrorResponse } from "@/types/site"
import { useRouter } from "next/navigation"

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    timezone: "UTC",
  })

  // Load sites on component mount
  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/sites")
      const data = await response.json()

      if (data.success) {
        setSites(data.sites)
      } else {
        setError(data.error || "Failed to load sites")
      }
    } catch (err) {
      setError("Failed to load sites")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.domain) {
      setError("Name and domain are required")
      return
    }

    try {
      setIsCreating(true)
      setError(null)

      const response = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSites([data.site, ...sites])
        setShowCreateForm(false)
        setFormData({ name: "", domain: "", timezone: "UTC" })
      } else {
        setError(data.error || "Failed to create site")
      }
    } catch (err) {
      setError("Failed to create site")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteSite = async (site: Site) => {
    if (!confirm(`Are you sure you want to delete "${site.name}"? This will permanently delete all analytics data for this site.`)) {
      return
    }

    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setSites(sites.filter(s => s.id !== site.id))
      } else {
        setError(data.error || "Failed to delete site")
      }
    } catch (err) {
      setError("Failed to delete site")
    }
  }

  const copyTrackingScript = (site: Site) => {
    const script = `<script async defer src="${window.location.origin}/m.js" data-site="${site.siteId}"></script>`
    navigator.clipboard.writeText(script)
  }

  const getTrackingScript = (site: Site) => {
    return `<script async defer src="${window.location.origin}/m.js" data-site="${site.siteId}"></script>`
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Sites</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your analytics sites</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 bg-card border-border shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Sites</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your analytics sites</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Site
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Create Site Form */}
      {showCreateForm && (
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Create New Site</h2>
          <form onSubmit={handleCreateSite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Website"
                  required
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="example.com"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Site"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setFormData({ name: "", domain: "", timezone: "UTC" })
                  setError(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Sites Grid */}
      {sites.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No sites yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first site to start tracking analytics
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Site
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card key={site.id} className="p-6 bg-card border-border shadow-sm">
              <div className="space-y-4">
                {/* Site Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground truncate">{site.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{site.domain}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {site.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/dashboard/sites/${site.id}`)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSite(site)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Site ID */}
                <div>
                  <Label className="text-xs text-muted-foreground">Site ID</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 truncate">
                      {site.siteId}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(site.siteId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Tracking Script */}
                <div>
                  <Label className="text-xs text-muted-foreground">Tracking Script</Label>
                  <div className="mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyTrackingScript(site)}
                      className="w-full justify-start text-xs"
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      Copy Script
                    </Button>
                  </div>
                </div>

                {/* Created Date */}
                <div className="text-xs text-muted-foreground">
                  Created {new Date(site.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}