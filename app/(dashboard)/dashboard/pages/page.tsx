"use client"

import { useState, useEffect } from "react"
import { TimeRangeSelector, type TimeRange } from "@/components/dashboard/time-range-selector"
import { SiteSelector } from "@/components/dashboard/site-selector"
import { LoadingState } from "@/components/dashboard/loading-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PageData {
  pathname: string;
  views: number;
  uniqueVisitors: number;
}

interface PagesResponse {
  pages: PageData[];
}

export default function PagesPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;

    async function fetchPages() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics/pages?siteId=${siteId}&timeRange=${timeRange}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch pages");
        }
        const json: PagesResponse = await res.json();
        setData(json.pages || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pages");
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, [siteId, timeRange]);

  // Loading state
  if (!siteId || loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pages</h1>
            <p className="text-sm text-muted-foreground mt-1">Detailed page performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          </div>
        </div>
        {siteId && <LoadingState message="Loading page analytics..." />}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pages</h1>
            <p className="text-sm text-muted-foreground mt-1">Detailed page performance metrics</p>
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
  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pages</h1>
            <p className="text-sm text-muted-foreground mt-1">Detailed page performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
        <EmptyState title="No page data" description="No pages have been viewed during this period." />
      </div>
    );
  }

  // Main view with data
  return (
    <div className="space-y-6">
      {/* Page Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} page{data.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
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
              </tr>
            </thead>
            <tbody>
              {data.map((page, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2 text-sm font-mono text-card-foreground">{page.pathname}</td>
                  <td className="py-3 px-2 text-sm text-right font-medium text-card-foreground">
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
    </div>
  )
}
