"use client"

import { useState, useEffect } from "react"
import { TimeRangeSelector, type TimeRange } from "@/components/dashboard/time-range-selector"
import { SiteSelector } from "@/components/dashboard/site-selector"
import { LoadingState } from "@/components/dashboard/loading-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Card } from "@/components/ui/card"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

interface DeviceItem {
  device: string;
  count: number;
}

interface BrowserItem {
  browser: string;
  version: string;
  count: number;
}

interface OSItem {
  os: string;
  version: string;
  count: number;
}

interface DevicesResponse {
  devices: DeviceItem[];
  browsers: BrowserItem[];
  os: OSItem[];
}

const deviceColors: Record<string, string> = {
  "Desktop": "oklch(0.60 0.22 264)",
  "Mobile": "oklch(0.70 0.20 220)",
  "Tablet": "oklch(0.75 0.15 280)",
  "Unknown": "oklch(0.50 0 0)",
};

export default function DevicesPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<DevicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;

    async function fetchDevices() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics/devices?siteId=${siteId}&timeRange=${timeRange}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch devices");
        }
        const json: DevicesResponse = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load devices");
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, [siteId, timeRange]);

  // Helper to calculate percentage
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
            <h1 className="text-2xl font-semibold text-foreground">Devices</h1>
            <p className="text-sm text-muted-foreground mt-1">Device, browser, and operating system analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          </div>
        </div>
        {siteId && <LoadingState message="Loading device analytics..." />}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Devices</h1>
            <p className="text-sm text-muted-foreground mt-1">Device, browser, and operating system analytics</p>
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
  if (!data || (data.devices.length === 0 && data.browsers.length === 0 && data.os.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Devices</h1>
            <p className="text-sm text-muted-foreground mt-1">Device, browser, and operating system analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
        <EmptyState title="No device data" description="No device analytics available for this period." />
      </div>
    );
  }

  // Prepare data for charts
  const deviceChartData = data.devices.map(d => ({
    name: d.device,
    value: d.count,
    color: deviceColors[d.device] || deviceColors["Unknown"],
  }));

  const browserChartData = data.browsers.map(b => ({
    name: `${b.browser} ${b.version}`,
    visits: b.count,
  }));

  const totalOS = data.os.reduce((sum, os) => sum + os.count, 0);

  // Find individual device counts
  const desktopCount = data.devices.find(d => d.device === "Desktop")?.count || 0;
  const mobileCount = data.devices.find(d => d.device === "Mobile")?.count || 0;
  const tabletCount = data.devices.find(d => d.device === "Tablet")?.count || 0;

  // Main view with data
  return (
    <div className="space-y-6">
      {/* Page Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Devices</h1>
          <p className="text-sm text-muted-foreground mt-1">Device, browser, and operating system analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <SiteSelector onSiteChange={setSiteId} selectedSiteId={siteId || undefined} />
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
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
              <p className="text-2xl font-semibold text-card-foreground">{desktopCount.toLocaleString()}</p>
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
              <p className="text-2xl font-semibold text-card-foreground">{mobileCount.toLocaleString()}</p>
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
              <p className="text-2xl font-semibold text-card-foreground">{tabletCount.toLocaleString()}</p>
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
                data={deviceChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {deviceChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {deviceChartData.map((device, index) => (
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
          {browserChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={browserChartData.slice(0, 10)}>
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
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              No browser data available
            </div>
          )}
        </Card>
      </div>

      {/* OS Table */}
      <Card className="p-6 bg-card border-border shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Operating Systems</h2>
        {data.os.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Operating System</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Version</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Count</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.os.map((os, index) => {
                  const percentage = calculatePercentage(os.count, totalOS);
                  return (
                    <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 text-sm text-card-foreground">{os.os}</td>
                      <td className="py-3 px-2 text-sm text-right text-muted-foreground">{os.version}</td>
                      <td className="py-3 px-2 text-sm text-right font-medium text-card-foreground">
                        {os.count.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
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
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No operating system data available
          </div>
        )}
      </Card>
    </div>
  )
}
