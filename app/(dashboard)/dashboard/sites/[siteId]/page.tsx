"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Copy, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Code,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface Site {
  id: string
  name: string
  domain: string
  siteId: string
  timezone: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export default function SiteDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const siteId = params.siteId as string

  const [site, setSite] = useState<Site | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    timezone: "UTC",
  })

  useEffect(() => {
    fetchSite()
  }, [siteId])

  const fetchSite = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/sites/${siteId}`)
      const data = await response.json()

      if (response.ok) {
        setSite(data.site)
        setFormData({
          name: data.site.name,
          domain: data.site.domain,
          timezone: data.site.timezone,
        })
      } else {
        setError(data.error || "Failed to fetch site")
      }
    } catch (err) {
      setError("An error occurred while fetching site")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsSaving(true)

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSite(data.site)
        setSuccessMessage("Site updated successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setError(data.error || "Failed to update site")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setError("")
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/dashboard/sites")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete site")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccessMessage("Copied to clipboard!")
    setTimeout(() => setSuccessMessage(""), 2000)
  }

  const trackingScript = site ? `<!-- Microlytics Tracking Script -->
<script async defer src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/m.js" data-site="${site.siteId}"></script>` : ""

  const trackingScriptProd = site ? `<!-- Microlytics Tracking Script (Minified) -->
<script async defer src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/m.min.js" data-site="${site.siteId}"></script>` : ""

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading site...</div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/sites">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Sites
            </Button>
          </Link>
        </div>
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Site not found</h2>
          <p className="text-muted-foreground">
            This site doesn't exist or you don't have access to it.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/sites">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sites
          </Button>
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {successMessage}
        </div>
      )}

      {/* Tracking Script */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Installation Script</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Copy and paste this code into the <code className="px-1 py-0.5 bg-muted rounded text-xs">&lt;head&gt;</code> section of your website
          </p>
          
          {/* Development Script */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium text-muted-foreground">Development (Unminified)</Label>
            </div>
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                <code>{trackingScript}</code>
              </pre>
              <Button
                onClick={() => copyToClipboard(trackingScript)}
                className="absolute top-2 right-2"
                size="sm"
                variant="secondary"
              >
                <Copy className="h-3 w-3 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Production Script */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium text-muted-foreground">Production (Minified)</Label>
            </div>
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                <code>{trackingScriptProd}</code>
              </pre>
              <Button
                onClick={() => copyToClipboard(trackingScriptProd)}
                className="absolute top-2 right-2"
                size="sm"
                variant="secondary"
              >
                <Copy className="h-3 w-3 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Tracking script is now active! 🎉</p>
              <p className="text-xs mt-1 text-green-600">
                Phase 4 complete! The script will track pageviews. Full analytics dashboard coming in Phase 6.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Site Settings */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Site Settings</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Site Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Website"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-domain">Domain</Label>
              <Input
                id="edit-domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-timezone">Timezone</Label>
              <select
                id="edit-timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Shanghai">Shanghai</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Site Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Site Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Site ID</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                  {site.siteId}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(site.siteId)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Created</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded text-sm">
                <Clock className="h-4 w-4" />
                {new Date(site.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-500/20">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Deleting this site will permanently remove all associated analytics data
            </p>
          </div>

          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Site
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm font-medium text-red-500">
                Are you sure? This action cannot be undone.
              </p>
              <p className="text-xs text-muted-foreground">
                All pageviews, events, and analytics data for "{site.name}" will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  {isDeleting ? (
                    "Deleting..."
                  ) : (
                    <>
                      <Trash2 className="h-3 w-3" />
                      Yes, Delete Site
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

