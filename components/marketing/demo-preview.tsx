"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Users, Eye, MousePointer, TrendingUp, Zap, Award, Globe, Github } from "lucide-react"
import { FaXTwitter, FaGoogle, FaGithub } from "react-icons/fa6"
import { useState } from "react"

const topPages = [
  { path: "/blog/privacy-matters", views: 1243, visitors: 892 },
  { path: "/", views: 2156, visitors: 1654 },
  { path: "/pricing", views: 876, visitors: 743 },
  { path: "/docs/getting-started", views: 654, visitors: 521 },
]

const referrers = [
  { source: "x.com", visitors: 432, percentage: 28, icon: FaXTwitter, color: "from-gray-800 to-black", progressColor: "from-blue-500 to-violet-500" },
  { source: "google.com", visitors: 389, percentage: 25, icon: FaGoogle, color: "from-blue-500 to-red-500", progressColor: "from-blue-500 to-violet-500" },
  { source: "Direct", visitors: 312, percentage: 20, icon: MousePointer, color: "from-gray-400 to-gray-600", progressColor: "from-blue-500 to-violet-500" },
  { source: "github.com", visitors: 234, percentage: 15, icon: FaGithub, color: "from-gray-700 to-gray-900", progressColor: "from-blue-500 to-violet-500" },
]

export function DemoPreview() {
  const [, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left side - Heading */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <Badge variant="outline" className="border-blue-400/50 text-blue-400 px-2 py-1 text-xs">
              Live Demo
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Understand your visitors in seconds
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              A clean, intuitive dashboard that shows you exactly what you need to know about your website traffic.
            </p>

            {/* Exciting Visual Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="glass border-white/20 p-4 rounded-xl glow-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <FaXTwitter className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">10.2K</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <FaXTwitter className="h-3 w-3" />
                      X referrals
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                  <span className="text-xs text-green-400">+47%</span>
                </div>
              </div>

              <div className="glass border-white/20 p-4 rounded-xl glow-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">2.4s</div>
                    <div className="text-xs text-gray-400">Load time</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                  <span className="text-xs text-green-400">-32%</span>
                </div>
              </div>

              <div className="glass border-white/20 p-4 rounded-xl glow-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                  <span className="text-xs text-green-400">+2%</span>
                </div>
              </div>

              <div className="glass border-white/20 p-4 rounded-xl glow-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">45</div>
                    <div className="text-xs text-gray-400">Countries</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <span className="text-xs text-green-400">+12</span>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-6">
              <div className="glass border-white/20 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 border-2 border-white/20" />
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 border-2 border-white/20" />
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white/20" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">10,000+ developers</div>
                    <div className="text-xs text-gray-400">already tracking with Microlytics</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Real-time updates
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    Privacy-first
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    GDPR ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Demo content */}
          <div className="w-full flex items-start">
          <Card className="glass border-white/20 shadow-2xl overflow-hidden glow w-full h-full">
            <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-4 border-b border-white/10 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 text-center text-sm text-gray-400 font-mono">app.microlytics.io/dashboard</div>
            </div>

            <CardContent className="p-6 space-y-6 flex flex-col h-full justify-between">
              <div className="grid grid-cols-3 gap-3">
                <Card
                  className="glass border-white/20 glow-hover transition-all duration-300"
                  onMouseEnter={() => setHoveredCard(0)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                        <Eye className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-xs text-gray-400">Page Views</div>
                      <div className="text-2xl font-bold text-white">12.5K</div>
                      <div className="text-xs text-green-400">+18%</div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="glass border-white/20 glow-hover transition-all duration-300"
                  onMouseEnter={() => setHoveredCard(1)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                        <Users className="h-4 w-4 text-violet-400" />
                      </div>
                      <div className="text-xs text-gray-400">Visitors</div>
                      <div className="text-2xl font-bold text-white">8.2K</div>
                      <div className="text-xs text-green-400">+24%</div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="glass border-white/20 glow-hover transition-all duration-300"
                  onMouseEnter={() => setHoveredCard(2)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                        <MousePointer className="h-4 w-4 text-pink-400" />
                      </div>
                      <div className="text-xs text-gray-400">Bounce</div>
                      <div className="text-2xl font-bold text-white">42%</div>
                      <div className="text-xs text-green-400">-5%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                <Card className="glass border-white/20 h-full">
                  <CardContent className="p-4 h-full flex flex-col">
                    <h3 className="text-sm font-semibold mb-3 text-white">Top Pages</h3>
                    <div className="space-y-2 flex-1">
                      {topPages.map((page, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0"
                        >
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs truncate font-mono text-gray-300">{page.path}</span>
                          </div>
                          <span className="font-semibold text-white text-xs">{page.visitors}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20 h-full">
                  <CardContent className="p-4 h-full flex flex-col">
                    <h3 className="text-sm font-semibold mb-3 text-white">Top Referrers</h3>
                    <div className="space-y-3 flex-1">
                      {referrers.map((referrer, index) => {
                        const IconComponent = referrer.icon;
                        return (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${referrer.color} flex items-center justify-center`}>
                                  <IconComponent className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-xs font-medium text-white">{referrer.source}</span>
                              </div>
                              <span className="text-xs text-gray-400">{referrer.visitors}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${referrer.progressColor} rounded-full transition-all`}
                                style={{ width: `${referrer.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
