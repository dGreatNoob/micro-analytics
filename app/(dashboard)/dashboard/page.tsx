"use client"

import { useState, useEffect } from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { TimeRangeSelector, type TimeRange } from "@/components/dashboard/time-range-selector"
import { SiteSelector } from "@/components/dashboard/site-selector"
import { LoadingState } from "@/components/dashboard/loading-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Users, Clock, TrendingDown, Download, Settings } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"

interface OverviewData {
  totalPageviews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ pathname: string; views: number; uniqueVisitors: number }>;
  topReferrers: Array<{ referrer: string; visitors: number; pageviews: number }>;
}

const deviceData = [
  { name: "Desktop", value: 5234, color: "oklch(0.60 0.22 264)" },
  { name: "Mobile", value: 3891, color: "oklch(0.70 0.20 220)" },
  { name: "Tablet", value: 935, color: "oklch(0.75 0.15 280)" },
]

const visitData = [
  { date: "Day 1", visits: 0 },
  { date: "Day 2", visits: 0 },
  { date: "Day 3", visits: 0 },
  { date: "Day 4", visits: 0 },
  { date: "Day 5", visits: 0 },
  { date: "Day 6", visits: 0 },
  { date: "Day 7", visits: 0 },
]

export default function OverviewPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [siteName, setSiteName] = useState<string>("Site");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch site details when site ID changes
  useEffect(() => {
    if (!siteId) return;

    async function fetchSiteDetails() {
      try {
        const res = await fetch("/api/sites");
        if (res.ok) {
          const sitesData = await res.json();
          const currentSite = sitesData.sites?.find((s: { id: string }) => s.id === siteId);
          if (currentSite) {
            setSiteName(currentSite.domain);
          }
        }
      } catch (err) {
        console.error("Failed to fetch site details:", err);
      }
    }

    fetchSiteDetails();
  }, [siteId]);

  // Fetch overview data
  useEffect(() => {
    if (!siteId) return;

    async function fetchOverview() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics/overview?siteId=${siteId}&timeRange=${timeRange}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch analytics");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, [siteId, timeRange]);

  // Helper function to format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate percentage for referrers
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Loading state
  if (!siteId || loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Select a site to view analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          </div>
        </div>
        {siteId && <LoadingState />}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  // Empty state
  if (!data || data.totalPageviews === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">{siteName}</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
        <EmptyState />
      </div>
    );
  }

  // Main view with data
  const totalReferrerVisits = (data.topReferrers || []).reduce((sum, ref) => sum + ref.visitors, 0);

  return (
    <div className="space-y-6">
      {/* Page Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">{siteName}</p>
        </div>
        <div className="flex items-center gap-3">
          <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => window.location.href = '/dashboard/sites'}>
            <Settings className="h-4 w-4" />
            Manage Sites
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pageviews" 
          value={data.totalPageviews.toLocaleString()} 
          icon={<Eye className="h-5 w-5" />} 
        />
        <StatCard 
          title="Unique Visitors" 
          value={data.uniqueVisitors.toLocaleString()} 
          icon={<Users className="h-5 w-5" />} 
        />
        <StatCard 
          title="Avg. Session Duration" 
          value={formatDuration(data.avgSessionDuration)} 
          icon={<Clock className="h-5 w-5" />} 
        />
        <StatCard 
          title="Bounce Rate" 
          value={`${data.bounceRate.toFixed(1)}%`} 
          icon={<TrendingDown className="h-5 w-5" />} 
        />
      </div>

      {/* Visits Chart */}
      <Card className="p-6 bg-card border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-card-foreground">Daily Visits</h2>
          <p className="text-sm text-muted-foreground">Chart coming in Phase 7</p>
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
                </tr>
              </thead>
              <tbody>
                {(data.topPages || []).slice(0, 10).map((page, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm font-mono text-card-foreground">{page.pathname}</td>
                    <td className="py-3 px-2 text-sm text-right text-card-foreground">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-card-foreground">
                      {page.uniqueVisitors.toLocaleString()}
                    </td>
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
          <p className="text-xs text-muted-foreground mt-4">Real device data coming in Phase 7</p>
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
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Visitors</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Pageviews</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {(data.topReferrers || []).slice(0, 10).map((referrer, index) => {
                const percentage = calculatePercentage(referrer.visitors, totalReferrerVisits);
                return (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-card-foreground">{referrer.referrer}</td>
                    <td className="py-3 px-2 text-sm text-right text-card-foreground">
                      {referrer.visitors.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-card-foreground">
                      {referrer.pageviews.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground w-10">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
