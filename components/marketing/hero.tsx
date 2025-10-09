"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Shield, Cookie, Zap } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const chartData = [
  { date: "Mon", visitors: 420 },
  { date: "Tue", visitors: 580 },
  { date: "Wed", visitors: 720 },
  { date: "Thu", visitors: 650 },
  { date: "Fri", visitors: 890 },
  { date: "Sat", visitors: 1100 },
  { date: "Sun", visitors: 950 },
]

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
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
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700 text-base glow-hover w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base bg-transparent border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Live Demo
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-white">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                <Cookie className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-white">No Cookies</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium text-white">Open API</span>
              </div>
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
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: number) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 30, 40, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ color: "#fff" }}
                      itemStyle={{ color: "#3b82f6" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total visitors</span>
                  <span className="text-2xl font-bold text-white">5,310</span>
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
