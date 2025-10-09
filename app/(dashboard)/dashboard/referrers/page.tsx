"use client"

import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"

const referrersData = [
  { source: "google.com", visits: 4521, uniqueVisitors: 3892, percentage: 45, avgTime: "2m 45s" },
  { source: "twitter.com", visits: 2314, uniqueVisitors: 2103, percentage: 23, avgTime: "1m 52s" },
  { source: "github.com", visits: 1823, uniqueVisitors: 1654, percentage: 18, avgTime: "3m 12s" },
  { source: "Direct", visits: 1402, uniqueVisitors: 1289, percentage: 14, avgTime: "2m 18s" },
  { source: "linkedin.com", visits: 892, uniqueVisitors: 801, percentage: 9, avgTime: "2m 05s" },
  { source: "reddit.com", visits: 634, uniqueVisitors: 578, percentage: 6, avgTime: "3m 34s" },
  { source: "facebook.com", visits: 423, uniqueVisitors: 389, percentage: 4, avgTime: "1m 28s" },
  { source: "dev.to", visits: 312, uniqueVisitors: 287, percentage: 3, avgTime: "4m 12s" },
]

export default function ReferrersPage() {
  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Referrers</h1>
            <p className="text-sm text-muted-foreground mt-1">Traffic sources and referral analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <TimeRangeSelector />
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Referrers Table */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Source</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Visits</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Unique Visitors</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Avg. Time</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {referrersData.map((referrer, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-card-foreground">
                      <div className="flex items-center gap-2">
                        {referrer.source !== "Direct" && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        {referrer.source}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-medium text-card-foreground">
                      {referrer.visits.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-card-foreground">
                      {referrer.uniqueVisitors.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{referrer.avgTime}</td>
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
