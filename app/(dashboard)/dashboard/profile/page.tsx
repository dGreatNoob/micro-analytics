import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
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
                <label className="text-sm font-medium text-card-foreground block mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground block mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="john@example.com"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              <label className="text-sm font-medium text-card-foreground block mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="pt-2">
              <Button>Update Password</Button>
            </div>
          </div>
        </Card>
      </div>
  )
}
