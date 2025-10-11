"use client"

import type React from "react"
import type { Session } from "next-auth"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
<<<<<<< HEAD
import { LayoutDashboard, FileText, ExternalLink, Monitor, Moon, Sun, Menu, X, Settings } from "lucide-react"
=======
import { LayoutDashboard, FileText, ExternalLink, Monitor, Moon, Sun, Menu, X, Globe } from "lucide-react"
>>>>>>> origin/main
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { UserDropdown } from "@/components/dashboard/user-dropdown"
import Image from "next/image"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sites", href: "/dashboard/sites", icon: Settings },
  { name: "Pages", href: "/dashboard/pages", icon: FileText },
  { name: "Referrers", href: "/dashboard/referrers", icon: ExternalLink },
  { name: "Devices", href: "/dashboard/devices", icon: Monitor },
]

export function DashboardLayout({ 
  children, 
  session 
}: { 
  children: React.ReactNode
  session: Session
}) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header - Fixed at top */}
      <header className="h-16 border-b border-border bg-card shrink-0 fixed top-0 left-0 right-0 z-10">
        <div className="h-full flex items-center justify-between px-6 gap-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/app_icon.png" 
                alt="Microlytics Logo" 
                width={28} 
                height={28} 
                className="h-7 w-7"
              />
              <h1 className="text-xl font-semibold text-foreground">Microlytics</h1>
            </Link>
          </div>
          
          {/* Right: Theme Toggle and User Dropdown */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <UserDropdown session={session} />
          </div>
        </div>
      </header>

      {/* Main Layout - Below header */}
      <div className="flex-1 flex min-h-0 pt-16">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar flex flex-col transition-transform duration-300",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Usage Bar */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-sidebar-foreground/70">
                <span>Usage</span>
                <span className="font-medium">1,203 / 5,000</span>
              </div>
              <Progress value={24} className="h-1.5" />
              <p className="text-xs text-sidebar-foreground/50">views this month</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}