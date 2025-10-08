// Mock analytics data for the dashboard

export const visitData = [
  { date: "Jan 1", visits: 1200 },
  { date: "Jan 2", visits: 1400 },
  { date: "Jan 3", visits: 1100 },
  { date: "Jan 4", visits: 1600 },
  { date: "Jan 5", visits: 1800 },
  { date: "Jan 6", visits: 1500 },
  { date: "Jan 7", visits: 2100 },
]

export const topPages = [
  { page: "/", views: 3420, visitors: 2891, avgTime: "2m 34s", bounceRate: "38%", change: 12.5 },
  { page: "/blog", views: 2156, visitors: 1823, avgTime: "3m 12s", bounceRate: "42%", change: 8.3 },
  { page: "/pricing", views: 1847, visitors: 1654, avgTime: "1m 45s", bounceRate: "35%", change: -3.2 },
  { page: "/about", views: 1234, visitors: 1098, avgTime: "2m 01s", bounceRate: "45%", change: 5.7 },
  { page: "/contact", views: 892, visitors: 801, avgTime: "1m 23s", bounceRate: "52%", change: -1.4 },
  { page: "/blog/post-1", views: 756, visitors: 689, avgTime: "4m 12s", bounceRate: "28%", change: 15.2 },
  { page: "/blog/post-2", views: 634, visitors: 578, avgTime: "3m 45s", bounceRate: "31%", change: 9.8 },
  { page: "/features", views: 523, visitors: 467, avgTime: "2m 18s", bounceRate: "41%", change: 3.1 },
]

export const topReferrers = [
  { source: "google.com", visits: 4521, uniqueVisitors: 3892, percentage: 45, avgTime: "2m 45s" },
  { source: "twitter.com", visits: 2314, uniqueVisitors: 2103, percentage: 23, avgTime: "1m 52s" },
  { source: "github.com", visits: 1823, uniqueVisitors: 1654, percentage: 18, avgTime: "3m 12s" },
  { source: "Direct", visits: 1402, uniqueVisitors: 1289, percentage: 14, avgTime: "2m 18s" },
  { source: "linkedin.com", visits: 892, uniqueVisitors: 801, percentage: 9, avgTime: "2m 05s" },
  { source: "reddit.com", visits: 634, uniqueVisitors: 578, percentage: 6, avgTime: "3m 34s" },
  { source: "facebook.com", visits: 423, uniqueVisitors: 389, percentage: 4, avgTime: "1m 28s" },
  { source: "dev.to", visits: 312, uniqueVisitors: 287, percentage: 3, avgTime: "4m 12s" },
]

export const deviceData = [
  { name: "Desktop", value: 5234, color: "oklch(0.60 0.22 264)" },
  { name: "Mobile", value: 3891, color: "oklch(0.70 0.20 220)" },
  { name: "Tablet", value: 935, color: "oklch(0.75 0.15 280)" },
]

export const browserData = [
  { name: "Chrome", visits: 4521 },
  { name: "Safari", visits: 2314 },
  { name: "Firefox", visits: 1823 },
  { name: "Edge", visits: 892 },
  { name: "Other", visits: 510 },
]

export const osData = [
  { os: "Windows", visits: 3892, percentage: 39 },
  { os: "macOS", visits: 2456, percentage: 24 },
  { os: "iOS", visits: 1823, percentage: 18 },
  { os: "Android", visits: 1234, percentage: 12 },
  { os: "Linux", visits: 655, percentage: 7 },
]

export const stats = {
  totalVisits: "10,234",
  totalVisitsChange: 12.5,
  uniqueVisitors: "8,456",
  uniqueVisitorsChange: 8.2,
  avgTimeOnPage: "2m 18s",
  avgTimeOnPageChange: -3.1,
  bounceRate: "42.3%",
  bounceRateChange: -5.4,
}

