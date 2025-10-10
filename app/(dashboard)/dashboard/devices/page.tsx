"use client"

import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Monitor, Smartphone, Tablet } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

const deviceData = [
  { name: "Desktop", value: 5234, color: "oklch(0.60 0.22 264)" },
  { name: "Mobile", value: 3891, color: "oklch(0.70 0.20 220)" },
  { name: "Tablet", value: 935, color: "oklch(0.75 0.15 280)" },
]

const browserData = [
  { name: "Chrome", visits: 4521 },
  { name: "Safari", visits: 2314 },
  { name: "Firefox", visits: 1823 },
  { name: "Edge", visits: 892 },
  { name: "Other", visits: 510 },
]

const osData = [
  { os: "Windows", visits: 3892, percentage: 39 },
  { os: "macOS", visits: 2456, percentage: 24 },
  { os: "iOS", visits: 1823, percentage: 18 },
  { os: "Android", visits: 1234, percentage: 12 },
  { os: "Linux", visits: 655, percentage: 7 },
]

export default function DevicesPage() {
  return (
      <div className="space-y-6 ">
        {/* Page Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Devices</h1>
            <p className="text-sm text-muted-foreground mt-1">Device, browser, and operating system analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <TimeRangeSelector />
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Device Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Monitor className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Desktop</p>
                <p className="text-2xl font-semibold text-card-foreground">{deviceData[0].value.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-2/10" style={{ color: "oklch(0.70 0.20 220)" }}>
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="text-2xl font-semibold text-card-foreground">{deviceData[1].value.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-3/10" style={{ color: "oklch(0.75 0.15 280)" }}>
                <Tablet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tablet</p>
                <p className="text-2xl font-semibold text-card-foreground">{deviceData[2].value.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Distribution */}
          <Card className="p-6 bg-card border-border shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Device Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
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

          {/* Browser Stats */}
          <Card className="p-6 bg-card border-border shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Browser Usage</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={browserData}>
                <XAxis dataKey="name" stroke="oklch(0.50 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.50 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.15 0 0)",
                    border: "1px solid oklch(0.25 0 0)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0 0)",
                  }}
                />
                <Bar dataKey="visits" fill="oklch(0.60 0.22 264)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* OS Table */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Operating Systems</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Operating System</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Visits</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {osData.map((os, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-card-foreground">{os.os}</td>
                    <td className="py-3 px-2 text-sm text-right font-medium text-card-foreground">
                      {os.visits.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${os.percentage}%` }} />
                        </div>
                        <span className="text-muted-foreground w-10">{os.percentage}%</span>
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
