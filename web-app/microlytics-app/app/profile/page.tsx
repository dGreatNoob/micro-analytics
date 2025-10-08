"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Profile Info */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="full-name" className="block mb-2">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block mb-2">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john@example.com"
                />
              </div>
              <div className="pt-2">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Password */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Change Password</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="current-password" className="block mb-2">Current Password</Label>
              <Input
                id="current-password"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="block mb-2">New Password</Label>
              <Input
                id="new-password"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="block mb-2">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
              />
            </div>
            <div className="pt-2">
              <Button>Update Password</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
