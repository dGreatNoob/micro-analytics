# Phase 6: Dashboard Data Layer - Implementation Guide

## 📋 Overview

This guide details the remaining implementation work for Phase 6. The **backend APIs are complete** (6/18 tasks done). This guide covers connecting the **frontend dashboard UI** to those APIs.

---

## ✅ What's Already Complete

### Backend APIs (All Working)
1. ✅ `/api/analytics/overview` - Total stats (pageviews, visitors, avg time, bounce rate)
2. ✅ `/api/analytics/pages` - Top pages with views and unique visitors
3. ✅ `/api/analytics/referrers` - Top referrers with counts
4. ✅ `/api/analytics/devices` - Device/browser/OS breakdown

### Utilities & Dependencies
- ✅ `date-fns` installed for date manipulation
- ✅ `lib/analytics-utils.ts` created with helper functions:
  - `getDateRange()` - Converts "7d", "30d", "90d" to start/end dates
  - `calculateBounceRate()` - Computes bounce rate from pageviews
  - `calculateAvgSessionDuration()` - Computes average time on site
  - `aggregateByTimeUnit()` - Groups data by day/week/month

---

## 🎯 Remaining Tasks (12 Total)

### **Task 1: Add Site Selection to Dashboard** [Priority: HIGH]
**Status:** Pending  
**Location:** `app/(dashboard)/dashboard/page.tsx` or new shared component  
**Time Estimate:** 30 minutes

#### What to Implement:
- Create a site selector dropdown in the dashboard header/layout
- Fetch user's sites from `/api/sites`
- Store selected site ID in state (or URL query param)
- Pass selected site to all analytics pages

#### Implementation Details:
```typescript
// components/dashboard/site-selector.tsx
"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Site {
  id: string;
  name: string;
  domain: string;
}

export function SiteSelector({ onSiteChange }: { onSiteChange: (siteId: string) => void }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      const res = await fetch("/api/sites");
      if (res.ok) {
        const data = await res.json();
        setSites(data.sites || []);
        if (data.sites?.length > 0) {
          onSiteChange(data.sites[0].id); // Auto-select first site
        }
      }
      setLoading(false);
    }
    fetchSites();
  }, [onSiteChange]);

  if (loading) return <div>Loading sites...</div>;
  if (sites.length === 0) return <div>No sites found. <a href="/dashboard/sites">Create one</a></div>;

  return (
    <Select onValueChange={onSiteChange} defaultValue={sites[0]?.id}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a site" />
      </SelectTrigger>
      <SelectContent>
        {sites.map(site => (
          <SelectItem key={site.id} value={site.id}>
            {site.name} ({site.domain})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

#### Where to Add It:
- Option A: In `components/dashboard/dashboard-layout.tsx` (persistent across all pages)
- Option B: In each individual page (more flexible but repetitive)

**Recommended:** Option A - Add to dashboard layout header

---

### **Task 2: Connect Dashboard Overview Page** [Priority: HIGH]
**Status:** Pending  
**Location:** `app/(dashboard)/dashboard/page.tsx`  
**Time Estimate:** 45 minutes

#### Current State:
```typescript
// Currently uses mock data from lib/mockData.ts
const analytics = {
  totalPageviews: 125430,
  uniqueVisitors: 8234,
  // ... mock data
};
```

#### What to Change:
Replace mock data with real API calls to `/api/analytics/overview`

#### Implementation:
```typescript
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector";
import { SiteSelector } from "@/components/dashboard/site-selector";

type TimeRange = "7d" | "30d" | "90d";

interface OverviewData {
  totalPageviews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ pathname: string; views: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

export default function DashboardPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;

    async function fetchOverview() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics/overview?siteId=${siteId}&timeRange=${timeRange}`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, [siteId, timeRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Overview</h1>
        <div className="flex items-center gap-4">
          <SiteSelector onSiteChange={setSiteId} />
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="text-center py-12">Loading analytics...</div>}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error: {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data?.totalPageviews === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No data available for this period.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure your tracking script is installed.
          </p>
        </div>
      )}

      {/* Data Display */}
      {!loading && !error && data && data.totalPageviews > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Pageviews"
              value={data.totalPageviews.toLocaleString()}
              icon="📊"
            />
            <StatCard
              title="Unique Visitors"
              value={data.uniqueVisitors.toLocaleString()}
              icon="👥"
            />
            <StatCard
              title="Avg. Session Duration"
              value={`${Math.round(data.avgSessionDuration / 60)}m ${data.avgSessionDuration % 60}s`}
              icon="⏱️"
            />
            <StatCard
              title="Bounce Rate"
              value={`${data.bounceRate.toFixed(1)}%`}
              icon="🔄"
            />
          </div>

          {/* Top Pages & Referrers */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* ... existing chart components */}
          </div>
        </>
      )}
    </div>
  );
}
```

---

### **Task 3: Connect Pages Page** [Priority: HIGH]
**Status:** Pending  
**Location:** `app/(dashboard)/dashboard/pages/page.tsx`  
**Time Estimate:** 30 minutes

#### Implementation Pattern:
Same as Task 2, but call `/api/analytics/pages` and display in a table:

```typescript
const res = await fetch(`/api/analytics/pages?siteId=${siteId}&timeRange=${timeRange}`);
const data = await res.json();

// Display data.pages in a table with columns: Page, Views, Unique Visitors
```

---

### **Task 4: Connect Referrers Page** [Priority: MEDIUM]
**Status:** Pending  
**Location:** `app/(dashboard)/dashboard/referrers/page.tsx`  
**Time Estimate:** 30 minutes

#### API Call:
```typescript
const res = await fetch(`/api/analytics/referrers?siteId=${siteId}&timeRange=${timeRange}`);
const data = await res.json();

// Display data.referrers in a table: Referrer, Visitors, Pageviews
```

---

### **Task 5: Connect Devices Page** [Priority: MEDIUM]
**Status:** Pending  
**Location:** `app/(dashboard)/dashboard/devices/page.tsx`  
**Time Estimate:** 30 minutes

#### API Call:
```typescript
const res = await fetch(`/api/analytics/devices?siteId=${siteId}&timeRange=${timeRange}`);
const data = await res.json();

// Display data.devices, data.browsers, data.os in separate sections
```

---

### **Task 6: Implement Time Range Selector** [Priority: MEDIUM]
**Status:** Pending  
**Location:** `components/dashboard/time-range-selector.tsx`  
**Time Estimate:** 20 minutes

#### Current State:
Component exists but may not be functional

#### Make It Functional:
```typescript
"use client";

import { Button } from "@/components/ui/button";

interface TimeRangeSelectorProps {
  value: "7d" | "30d" | "90d";
  onChange: (range: "7d" | "30d" | "90d") => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === "7d" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("7d")}
      >
        7 Days
      </Button>
      <Button
        variant={value === "30d" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("30d")}
      >
        30 Days
      </Button>
      <Button
        variant={value === "90d" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("90d")}
      >
        90 Days
      </Button>
    </div>
  );
}
```

---

### **Task 7-9: Add Loading/Error/Empty States** [Priority: MEDIUM]
**Status:** Pending  
**Time Estimate:** 45 minutes total (15 min each)

#### Create Reusable Components:

**Loading State:**
```typescript
// components/dashboard/loading-state.tsx
export function LoadingState({ message = "Loading analytics..." }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
```

**Error State:**
```typescript
// components/dashboard/error-state.tsx
export function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-800 font-medium mb-2">Error loading analytics</p>
      <p className="text-red-600 text-sm mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}
```

**Empty State:**
```typescript
// components/dashboard/empty-state.tsx
export function EmptyState({ 
  title = "No data available",
  description = "No analytics data for this period.",
  actionLabel = "View Setup Guide",
  actionHref = "/dashboard/sites"
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button asChild variant="outline">
        <a href={actionHref}>{actionLabel}</a>
      </Button>
    </div>
  );
}
```

#### Apply to All Pages:
Use these components in `page.tsx`, `pages/page.tsx`, `referrers/page.tsx`, `devices/page.tsx`

---

### **Task 10: Test with Real Data** [Priority: HIGH]
**Status:** Pending  
**Time Estimate:** 30 minutes

#### Testing Checklist:
1. Open http://localhost:3000/dashboard
2. Select your test site (Test Site - iam2ttdx8jgnvfpg5aikziun)
3. Verify all 4 stat cards show real numbers from the 10,922 pageviews
4. Switch between 7d / 30d / 90d time ranges
5. Navigate to /dashboard/pages - verify page list
6. Navigate to /dashboard/referrers - verify referrer list
7. Navigate to /dashboard/devices - verify device breakdown

#### Expected Results:
- All pages load within 1 second
- Data matches what's in Prisma Studio
- No console errors
- Loading states appear briefly
- Empty state shows if no data for selected range

---

### **Task 11: Verify Performance** [Priority: MEDIUM]
**Status:** Pending  
**Time Estimate:** 15 minutes

#### Performance Criteria:
- Dashboard loads in **< 1 second**
- API responses in **< 200ms**
- No layout shift during data load

#### How to Test:
```bash
# Open browser DevTools > Network tab
# Reload /dashboard
# Check:
# - Overview API: < 200ms
# - Pages API: < 200ms
# - Referrers API: < 200ms
# - Devices API: < 200ms
```

---

### **Task 12: Create Documentation** [Priority: LOW]
**Status:** Pending  
**Time Estimate:** 30 minutes

#### Create: `docs/phases/phase-6/PHASE-6-COMPLETE.md`

**Include:**
- Summary of what was built
- API endpoints created
- Dashboard pages connected
- Performance benchmarks
- Screenshots (optional)
- Known limitations
- Next steps (Phase 7)

---

## 🚀 Implementation Order (Recommended)

### Day 1: Core Functionality (3-4 hours)
1. Task 1: Site Selector (30 min)
2. Task 6: Time Range Selector (20 min)
3. Task 2: Dashboard Overview Page (45 min)
4. Task 7-9: Loading/Error/Empty States (45 min)
5. Task 3: Pages Page (30 min)
6. **CHECKPOINT:** Test overview + pages

### Day 2: Remaining Pages + Polish (2-3 hours)
7. Task 4: Referrers Page (30 min)
8. Task 5: Devices Page (30 min)
9. Task 10: Full Testing (30 min)
10. Task 11: Performance Verification (15 min)
11. Task 12: Documentation (30 min)
12. **FINAL:** Commit + celebrate 🎉

---

## 🐛 Common Issues & Solutions

### Issue 1: "Unauthorized" API errors
**Cause:** APIs require authentication  
**Solution:** Make sure pages use `"use client"` and user is logged in

### Issue 2: Site ID is null
**Cause:** SiteSelector hasn't loaded yet  
**Solution:** Add `if (!siteId) return <LoadingState />` check

### Issue 3: TypeScript errors on data types
**Cause:** API response types not matching  
**Solution:** Define proper interfaces for each API response

### Issue 4: Data not updating when changing time range
**Cause:** Missing dependency in `useEffect`  
**Solution:** Ensure `[siteId, timeRange]` is in dependency array

---

## 📊 Success Criteria

Phase 6 is complete when:
- ✅ All 4 analytics pages fetch real data from APIs
- ✅ Site selector works and persists selection
- ✅ Time range selector filters data correctly
- ✅ Loading states show during data fetch
- ✅ Error states handle API failures gracefully
- ✅ Empty states guide users when no data exists
- ✅ Dashboard loads in < 1 second
- ✅ All 10,922 pageviews are correctly displayed
- ✅ Documentation is complete

---

## 🎯 Next Phase Preview

After Phase 6 is complete, Phase 7 will add:
- Real-time data updates (WebSocket or polling)
- Advanced filtering (by device, browser, country)
- Date range picker (custom ranges)
- Export functionality (CSV, PDF)
- Dashboard charts & graphs

---

**Ready to implement? Start with Task 1 (Site Selector) and work through sequentially!**

🚀 Let's ship Phase 6!

