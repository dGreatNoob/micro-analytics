"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Shield, Cookie, Zap } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useState } from "react"

const chartData = [
  { date: "Mon", site1: 420, site2: 320, site3: 280 },
  { date: "Tue", site1: 580, site2: 450, site3: 380 },
  { date: "Wed", site1: 720, site2: 590, site3: 490 },
  { date: "Thu", site1: 650, site2: 540, site3: 450 },
  { date: "Fri", site1: 890, site2: 720, site3: 620 },
  { date: "Sat", site1: 1100, site2: 890, site3: 750 },
  { date: "Sun", site1: 950, site2: 780, site3: 680 },
]

const siteConfig = [
  { key: "site1", name: "mywebsite.com", color: "#3b82f6", gradientId: "colorSite1" },
  { key: "site2", name: "myblog.com", color: "#8b5cf6", gradientId: "colorSite2" },
  { key: "site3", name: "myshop.com", color: "#ec4899", gradientId: "colorSite3" },
]

// Tooltip component
function TooltipBadge({ 
  children, 
  tooltip, 
  delay = 300 
}: { 
  children: React.ReactNode
  tooltip: string
  delay?: number 
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => setShowTooltip(true), delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setShowTooltip(false)
  }

  return (
    <div 
      className="relative cursor-pointer" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg z-50 border border-white/20 backdrop-blur-sm max-w-xs whitespace-normal shadow-lg">
          <div className="text-left leading-relaxed">{tooltip}</div>
          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90" />
        </div>
      )}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance text-white">
              See your traffic clearly — without invading privacy.
            </h1>

            <p className="text-xl text-gray-300 text-pretty leading-relaxed">
              Microlytics gives you beautiful, simple, privacy-first analytics for your websites — no cookies, no
              tracking bloat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700 text-base glow-hover"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Live Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-start gap-4 pt-4 pb-8">
              <TooltipBadge tooltip="Fully compliant with GDPR regulations. We don't collect personal data and respect user privacy.">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/5 transition-colors">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-white">GDPR Compliant</span>
                </div>
              </TooltipBadge>
              <TooltipBadge tooltip="No tracking cookies or local storage. Your visitors' privacy is completely protected.">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/5 transition-colors">
                  <Cookie className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">No Cookies</span>
                </div>
              </TooltipBadge>
              <TooltipBadge tooltip="Access your data through our REST API. Export, integrate, and build custom solutions.">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/5 transition-colors">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Open API</span>
                </div>
              </TooltipBadge>
            </div>
          </div>

          <div className="relative">
            <Card className="p-6 glass glow border-white/20 transform hover:rotate-1 transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Weekly Visitors</h3>
                  <p className="text-sm text-gray-400">Last 7 days</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">+24%</span>
                </div>
              </div>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      {siteConfig.map((site) => (
                        <linearGradient key={site.gradientId} id={site.gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={site.color} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={site.color} stopOpacity={0.05} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 30, 40, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ color: "#fff", fontWeight: "600" }}
                      formatter={(value: number, name: string) => {
                        const site = siteConfig.find(s => s.key === name)
                        return [value, site?.name || name]
                      }}
                    />
                    {siteConfig.map((site) => (
                      <Area
                        key={site.key}
                        type="monotone"
                        dataKey={site.key}
                        stroke={site.color}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill={`url(#${site.gradientId})`}
                        name={site.key}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 justify-center">
                  {siteConfig.map((site) => (
                    <div key={site.key} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: site.color }}
                      />
                      <span className="text-xs text-gray-300 font-medium">{site.name}</span>
                    </div>
                  ))}
                </div>
                
                {/* Total visitors */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Combined total visitors</span>
                  <span className="text-2xl font-bold text-white">14,720</span>
                </div>
              </div>
            </Card>

            {/* Glow effects */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-violet-500/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
