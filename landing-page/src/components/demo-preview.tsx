"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Users, Eye, MousePointer } from "lucide-react"
import { useState } from "react"

const topPages = [
  { path: "/blog/privacy-matters", views: 1243, visitors: 892 },
  { path: "/", views: 2156, visitors: 1654 },
  { path: "/pricing", views: 876, visitors: 743 },
  { path: "/docs/getting-started", views: 654, visitors: 521 },
]

const referrers = [
  { source: "twitter.com", visitors: 432, percentage: 28 },
  { source: "google.com", visitors: 389, percentage: 25 },
  { source: "Direct", visitors: 312, percentage: 20 },
  { source: "github.com", visitors: 234, percentage: 15 },
]

export function DemoPreview() {
  const [, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="demo" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-blue-400/50 text-blue-400">
            Live Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">
            Understand your visitors in seconds
          </h2>
          <p className="text-lg text-gray-300 text-pretty leading-relaxed">
            A clean, intuitive dashboard that shows you exactly what you need to know about your website traffic.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="glass border-white/20 shadow-2xl overflow-hidden glow">
            <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-4 border-b border-white/10 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 text-center text-sm text-gray-400 font-mono">app.microlytics.io/dashboard</div>
            </div>

            <CardContent className="p-8 space-y-8">
              <div className="grid sm:grid-cols-3 gap-4">
                <Card
                  className="glass border-white/20 glow-hover transition-all duration-300"
                  onMouseEnter={() => setHoveredCard(0)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                        <Eye className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="text-sm text-gray-400">Page Views</div>
                    </div>
                    <div className="text-3xl font-bold text-white">12,543</div>
                    <div className="text-sm text-green-400 mt-1">+18% from last week</div>
                  </CardContent>
                </Card>

                <Card
                  className="glass border-white/20 glow-hover transition-all duration-300"
                  onMouseEnter={() => setHoveredCard(1)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                        <Users className="h-5 w-5 text-violet-400" />
                      </div>
                      <div className="text-sm text-gray-400">Unique Visitors</div>
                    </div>
                    <div className="text-3xl font-bold text-white">8,234</div>
                    <div className="text-sm text-green-400 mt-1">+24% from last week</div>
                  </CardContent>
                </Card>

                <Card
                  className="glass border-white/20 glow-hover transition-all duration-300"
                  onMouseEnter={() => setHoveredCard(2)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                        <MousePointer className="h-5 w-5 text-pink-400" />
                      </div>
                      <div className="text-sm text-gray-400">Bounce Rate</div>
                    </div>
                    <div className="text-3xl font-bold text-white">42%</div>
                    <div className="text-sm text-green-400 mt-1">-5% from last week</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Top Pages</h3>
                    <div className="space-y-3">
                      {topPages.map((page, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate font-mono text-gray-300">{page.path}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400">{page.views} views</span>
                            <span className="font-semibold text-white">{page.visitors}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Top Referrers</h3>
                    <div className="space-y-4">
                      {referrers.map((referrer, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{referrer.source}</span>
                            <span className="text-sm text-gray-400">{referrer.visitors} visitors</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-violet-600 rounded-full transition-all"
                              style={{ width: `${referrer.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
