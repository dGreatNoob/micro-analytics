"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"

export default function SettingsPage() {
  const trackingScript = `<script async defer src="https://microlytics.app/scripts/m.js" data-site="SITE_ID"></script>`

  return (
      <div className="space-y-6 max-w-4xl">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your site configuration and tracking</p>
        </div>

        {/* Tracking Script */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">Tracking Script</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add this script to your website&apos;s{" "}
            <code className="px-1.5 py-0.5 bg-muted rounded text-xs">&lt;head&gt;</code> section to start tracking
          </p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground">
              {trackingScript}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => navigator.clipboard.writeText(trackingScript)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Site Settings */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Site Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="site-name" className="block mb-2">Site Name</Label>
              <Input
                id="site-name"
                type="text"
                defaultValue="mywebsite.com"
              />
            </div>
            <div>
              <Label htmlFor="site-url" className="block mb-2">Site URL</Label>
              <Input
                id="site-url"
                type="url"
                defaultValue="https://mywebsite.com"
              />
            </div>
            <div className="pt-2">
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 bg-card border-destructive/50 shadow-sm">
          <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">Permanently delete this site and all its data</p>
          <Button variant="destructive">Delete Site</Button>
        </Card>
      </div>
  )
}
