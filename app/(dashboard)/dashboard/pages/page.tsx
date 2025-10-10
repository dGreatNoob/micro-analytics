"use client"

import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown } from "lucide-react"

const pagesData = [
  { page: "/", views: 3420, uniqueVisitors: 2891, avgTime: "2m 34s", bounceRate: "38%", change: 12.5 },
  { page: "/blog", views: 2156, uniqueVisitors: 1823, avgTime: "3m 12s", bounceRate: "42%", change: 8.3 },
  { page: "/pricing", views: 1847, uniqueVisitors: 1654, avgTime: "1m 45s", bounceRate: "35%", change: -3.2 },
  { page: "/about", views: 1234, uniqueVisitors: 1098, avgTime: "2m 01s", bounceRate: "45%", change: 5.7 },
  { page: "/contact", views: 892, uniqueVisitors: 801, avgTime: "1m 23s", bounceRate: "52%", change: -1.4 },
  { page: "/blog/post-1", views: 756, uniqueVisitors: 689, avgTime: "4m 12s", bounceRate: "28%", change: 15.2 },
  { page: "/blog/post-2", views: 634, uniqueVisitors: 578, avgTime: "3m 45s", bounceRate: "31%", change: 9.8 },
  { page: "/features", views: 523, uniqueVisitors: 467, avgTime: "2m 18s", bounceRate: "41%", change: 3.1 },
]

export default function PagesPage() {
  return (
      <div className="space-y-6">
        {/* Page Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pages</h1>
            <p className="text-sm text-muted-foreground mt-1">Detailed page performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <TimeRangeSelector />
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Pages Table */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Page</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Views</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Unique Visitors</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Avg. Time</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Bounce Rate</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {pagesData.map((page, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 text-sm font-mono text-card-foreground">{page.page}</td>
                    <td className="py-3 px-2 text-sm text-right font-medium text-card-foreground">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-card-foreground">
                      {page.uniqueVisitors.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{page.avgTime}</td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{page.bounceRate}</td>
                    <td className="py-3 px-2 text-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        {page.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={page.change > 0 ? "text-green-500" : "text-red-500"}>
                          {page.change > 0 ? "+" : ""}
                          {page.change}%
                        </span>
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
