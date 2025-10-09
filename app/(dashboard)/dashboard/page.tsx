"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Users, Clock, TrendingDown, Download } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"

// Sample data
const visitData = [
  { date: "Jan 1", visits: 1200 },
  { date: "Jan 2", visits: 1400 },
  { date: "Jan 3", visits: 1100 },
  { date: "Jan 4", visits: 1600 },
  { date: "Jan 5", visits: 1800 },
  { date: "Jan 6", visits: 1500 },
  { date: "Jan 7", visits: 2100 },
]

const topPages = [
  { page: "/", views: 3420, visitors: 2891, avgTime: "2m 34s" },
  { page: "/blog", views: 2156, visitors: 1823, avgTime: "3m 12s" },
  { page: "/pricing", views: 1847, visitors: 1654, avgTime: "1m 45s" },
  { page: "/about", views: 1234, visitors: 1098, avgTime: "2m 01s" },
  { page: "/contact", views: 892, visitors: 801, avgTime: "1m 23s" },
]

const topReferrers = [
  { source: "google.com", visits: 4521, percentage: 45 },
  { source: "twitter.com", visits: 2314, percentage: 23 },
  { source: "github.com", visits: 1823, percentage: 18 },
  { source: "Direct", visits: 1402, percentage: 14 },
]

const deviceData = [
  { name: "Desktop", value: 5234, color: "oklch(0.60 0.22 264)" },
  { name: "Mobile", value: 3891, color: "oklch(0.70 0.20 220)" },
  { name: "Tablet", value: 935, color: "oklch(0.75 0.15 280)" },
]

export default function OverviewPage() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">mywebsite.com</p>
          </div>
          <div className="flex items-center gap-3">
            <TimeRangeSelector />
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Visits" value="10,234" change={12.5} icon={<Eye className="h-5 w-5" />} />
          <StatCard title="Unique Visitors" value="8,456" change={8.2} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Avg. Time on Page" value="2m 18s" change={-3.1} icon={<Clock className="h-5 w-5" />} />
          <StatCard title="Bounce Rate" value="42.3%" change={-5.4} icon={<TrendingDown className="h-5 w-5" />} />
        </div>

        {/* Visits Chart */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">Daily Visits</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.60 0.22 264)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.60 0.22 264)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="oklch(0.50 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.50 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.15 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)",
                }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="oklch(0.60 0.22 264)"
                strokeWidth={2}
                fill="url(#colorVisits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Tables and Device Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Pages */}
          <Card className="lg:col-span-2 p-6 bg-card border-border shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Top Pages</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Page</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Views</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Visitors</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Avg. Time</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page, index) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2 text-sm font-mono text-card-foreground">{page.page}</td>
                      <td className="py-3 px-2 text-sm text-right text-card-foreground">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-card-foreground">
                        {page.visitors.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-muted-foreground">{page.avgTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Device Breakdown */}
          <Card className="p-6 bg-card border-border shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Device Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                    <span className="text-sm text-card-foreground">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium text-card-foreground">{device.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Referrers */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Top Referrers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Source</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Visits</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {topReferrers.map((referrer, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-card-foreground">{referrer.source}</td>
                    <td className="py-3 px-2 text-sm text-right text-card-foreground">
                      {referrer.visits.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${referrer.percentage}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground w-10">{referrer.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
  )
}
