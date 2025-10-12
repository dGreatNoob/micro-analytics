"use client"

import { useState, useEffect } from "react"
import { TimeRangeSelector, type TimeRange } from "@/components/dashboard/time-range-selector"
import { SiteSelector } from "@/components/dashboard/site-selector"
import { LoadingState } from "@/components/dashboard/loading-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface ReferrerData {
  referrer: string;
  visitors: number;
  pageviews: number;
}

interface ReferrersResponse {
  referrers: ReferrerData[];
}

export default function ReferrersPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<ReferrerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;

    async function fetchReferrers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics/referrers?siteId=${siteId}&timeRange=${timeRange}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch referrers");
        }
        const json: ReferrersResponse = await res.json();
        setData(json.referrers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load referrers");
      } finally {
        setLoading(false);
      }
    }

    fetchReferrers();
  }, [siteId, timeRange]);

  // Calculate percentage for each referrer
  const totalVisitors = data.reduce((sum, ref) => sum + ref.visitors, 0);
  const calculatePercentage = (value: number) => {
    if (totalVisitors === 0) return 0;
    return Math.round((value / totalVisitors) * 100);
  };

  // Loading state
  if (!siteId || loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Referrers</h1>
            <p className="text-sm text-muted-foreground mt-1">Traffic sources and referral analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          </div>
        </div>
        {siteId && <LoadingState message="Loading referrer analytics..." />}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Referrers</h1>
            <p className="text-sm text-muted-foreground mt-1">Traffic sources and referral analytics</p>
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
            <h1 className="text-2xl font-semibold text-foreground">Referrers</h1>
            <p className="text-sm text-muted-foreground mt-1">Traffic sources and referral analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
        <EmptyState title="No referrer data" description="No traffic sources recorded during this period." />
      </div>
    );
  }

  // Main view with data
  return (
    <div className="space-y-6">
      {/* Page Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Referrers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} traffic source{data.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      {/* Referrers Table */}
      <Card className="p-6 bg-card border-border shadow-sm">
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
              {data.map((referrer, index) => {
                const percentage = calculatePercentage(referrer.visitors);
                return (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-card-foreground">
                      <div className="flex items-center gap-2">
                        {referrer.referrer !== "(direct)" && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        {referrer.referrer}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-medium text-card-foreground">
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
