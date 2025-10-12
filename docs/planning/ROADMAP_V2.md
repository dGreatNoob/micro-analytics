# Microlytics Roadmap v2 (Updated Build Order)

**Status:** Updated October 12, 2025
**Author:** Belteshazzar Marquez
**Scope:** Lean MVP for public launch (solo developer)

---

## Overview

This version corrects the development order based on system dependencies identified during analysis. The new order prioritizes completing the core vertical slice first:

> User creates site → installs tracking script → data is collected → analytics appear on dashboard.

This ensures an end-to-end working loop before expanding features.

---

## Phase Summary

| Phase | Name                    | Status        | Target Dates | Description                                                        |
| ----- | ----------------------- | ------------- | ------------ | ------------------------------------------------------------------ |
| 1     | Database Foundation     | ✅ Complete    | Oct 7        | PostgreSQL, Prisma schema, migrations, seeding.                    |
| 2     | Authentication System   | ✅ Complete    | Oct 9        | NextAuth.js with Google, GitHub, and credentials.                  |
| 2.1   | Authentication Fixes    | ✅ Complete    | Oct 11       | JWT sessions implemented and tested.                               |
| 2.5   | Welcome Emails          | ✅ Complete    | Oct 11       | Resend integration and welcome email system.                       |
| 3     | Tracking Script         | ✅ Complete    | Oct 12       | Lightweight `m.js` script to capture pageviews and events.         |
| 4     | Site Management         | ✅ Complete    | Oct 12       | Users can create/manage sites and generate tracking IDs.           |
| 5     | Data Ingestion API      | ✅ Complete    | Oct 12       | `/api/track` endpoint with validation, storage, device parsing.    |
| 6     | Dashboard Data Layer    | ✅ Complete    | Oct 12       | Analytics APIs and real-time dashboard with all visualizations.    |
| 7     | Advanced Features       | 🔜 Planned    | Nov 4–15     | Charts, real-time updates, advanced filtering, testing suite.      |
| 8     | MVP Polish & Deployment | 🔜 Planned    | Nov 16–20    | Final polish, onboarding flow, production deployment.              |
| 🚀    | Public MVP Launch       | 🔜 Goal       | Nov 18–20    | Announce launch, share demo, and collect feedback.                 |

---

## Development Details

### Phase 3 – Tracking Script ✅ Complete

**Status:** ✅ Complete (October 12, 2025)  
**Documentation:** `docs/phases/phase-4/PHASE-4-COMPLETE.md`

**Core Features:**
* Built `public/scripts/m.js` (<2KB gzipped)
* Collects: pathname, referrer, timestamp, browser, OS, device, screen size
* Generates visitor IDs (localStorage-based, privacy-first)
* Sends data via `navigator.sendBeacon()` to `/api/track`
* Gracefully handles errors (network failures, blocked requests)

**Definition of Done:**
- [x] Script loads and executes without errors
- [x] Captures pageview on page load
- [x] Sends data to /api/track with site ID
- [x] Works in Chrome, Safari, Firefox
- [x] Works on mobile browsers
- [x] Handles network failures gracefully
- [x] Script size <2KB minified + gzipped
- [x] No console errors in browser
- [x] Privacy-first (no cookies, no personal data)

**Technical Implementation:**
- Static files at `/public/scripts/m.js` and `m.min.js`
- Uses `navigator.sendBeacon()` with `fetch()` fallback
- Visitor ID generated from random string + localStorage
- Test page: `/public/test/index.html`

### Phase 4 – Site Management ✅ Complete

**Status:** ✅ Complete (October 12, 2025)  
**Documentation:** `docs/phases/phase-4/PHASE-4-COMPLETE.md`

**Core Features:**
* `/dashboard/sites` page with site list
* Create site form (name, domain, timezone validation)
* Site details page with tracking script copy functionality
* Edit site (name, domain, timezone)
* Delete site (with confirmation, cascades to pageviews)

**Definition of Done:**
- [x] User can create site with name/domain/timezone
- [x] User sees generated site ID (`cuid2`)
- [x] User can copy tracking script snippet
- [x] User can view list of all their sites
- [x] User can edit site details
- [x] User can delete site (requires confirmation)
- [x] All operations show loading states
- [x] All operations handle errors gracefully
- [x] Form validation works (domain format, required fields)

**Technical Implementation:**
- API Routes: `POST /api/sites`, `GET /api/sites`, `PATCH /api/sites/[id]`, `DELETE /api/sites/[id]`
- Uses `cuid2` for collision-resistant site ID generation
- Domain validation (allows localhost for testing)
- Stores: siteId, name, domain, userId, timezone, createdAt

### Phase 5 – Data Ingestion API ✅ Complete

**Status:** ✅ Complete (October 12, 2025)  
**Documentation:** `docs/phases/phase-5/PHASE-5-COMPLETE.md`

**Core Features:**
* Production-ready `/api/track` POST endpoint
* Request validation (site ID exists, valid payload)
* User-Agent parsing for browser/device/OS info
* Pageview storage in PostgreSQL
* IP address masking (privacy-first)
* Rate limiting (100 req/sec)
* Site caching for performance

**Definition of Done:**
- [x] Endpoint accepts POST requests
- [x] Validates site ID exists in database
- [x] Rejects invalid/malformed requests
- [x] Parses User-Agent correctly (uses `ua-parser-js`)
- [x] Stores pageview with all required fields
- [x] IP masking works (removes last octet/groups)
- [x] Returns 200 on success, 400/404 on errors
- [x] Logs detailed info in development mode
- [x] Responds in <100ms (40ms avg, 94ms P95)
- [x] Handles 100 requests/second (stress tested)

**Performance Results:**
- Average response: 40ms
- P95 latency: <100ms
- Error rate: 0%
- Sustained stability: 100 req/s for 30 seconds
- 10,827+ pageviews tracked successfully

**Technical Implementation:**
- Uses `ua-parser-js` for User-Agent parsing
- IP-based rate limiting (1000 req/10 sec)
- Site caching (in-memory, reduces DB load)
- Asynchronous DB writes (fire-and-forget pattern)
- Connection pooling (20 connections, 20s timeout)

### Phase 6 – Dashboard Data Layer ✅ Complete

**Status:** ✅ Complete (October 12, 2025)  
**Documentation:** `docs/phases/phase-6/PHASE-6-COMPLETE.md`

**Core Features:**
* 4 analytics API endpoints with time range filtering
* Aggregation queries for pages, referrers, devices
* Dashboard UI connected to real data (all mock data replaced)
* Professional loading, error, and empty states
* Site selector for multi-site support
* Time range selector (7d/30d/90d)

**API Endpoints:**
- `GET /api/analytics/overview?siteId=xxx&timeRange=xxx`
  - Returns: total pageviews, unique visitors, avg session duration, bounce rate, top pages, top referrers
- `GET /api/analytics/pages?siteId=xxx&timeRange=xxx`
  - Returns: all pages with views and unique visitors
- `GET /api/analytics/referrers?siteId=xxx&timeRange=xxx`
  - Returns: traffic sources with visitor and pageview counts
- `GET /api/analytics/devices?siteId=xxx&timeRange=xxx`
  - Returns: device/browser/OS breakdown with versions

**Definition of Done:**
- [x] All 4 endpoints return correct data
- [x] Time range filtering works (7d/30d/90d)
- [x] Queries optimized (leverages Phase 5 indexes)
- [x] Dashboard shows real data (10,827 pageviews)
- [x] Loading states display while fetching
- [x] Error states handle API failures
- [x] Empty states show when no data
- [x] Dashboard loads in <1 second (200-400ms observed)
- [x] Site ownership verification enforced
- [x] Multi-site support via dropdown selector

**Components Created:**
- `SiteSelector` - Multi-site dropdown
- `TimeRangeSelector` - 7d/30d/90d filtering
- `LoadingState`, `ErrorState`, `EmptyState` - UX states
- `Select` (UI component) - Radix UI dropdown

**Performance Results:**
- Dashboard load: 200-400ms
- API response: 105-135ms
- All pages working with real data
- Tested with 10,827 pageviews

**Technical Implementation:**
- Uses `date-fns` for date manipulation
- Aggregates data using Map structures
- Inherits Phase 5 optimizations (caching, pooling)
- Type-safe interfaces for all API responses

### Phase 7 – Advanced Dashboard Features & Testing

**Status:** 🔜 Planned (November 4–15, 2025)  
**Focus:** Enhanced visualizations, automated testing, quality assurance

**Core Features:**
* Time series charts (daily/weekly/monthly pageview trends)
* Real-time data updates (polling or WebSocket)
* Advanced filtering (by device, browser, country)
* Custom date range picker (select any start/end date)
* Export functionality (CSV, PDF reports)
* Comparison mode (compare time periods)

**Dashboard Enhancements:**
- [ ] Replace placeholder charts with real time-series data
- [ ] Add daily/weekly/monthly pageview trend charts
- [ ] Implement real-time updates (every 30-60 seconds)
- [ ] Add custom date range picker (not just 7d/30d/90d)
- [ ] Create export to CSV functionality
- [ ] Add period comparison (vs previous period)
- [ ] Show growth indicators on all metrics

**Automated Testing Suite:**

#### Integration Tests (Playwright or Jest + React Testing Library)
- [ ] Test /dashboard page: API fetch → render → UI state transitions
- [ ] Test /pages page: table rendering with real data
- [ ] Test /referrers page: percentage calculation accuracy
- [ ] Test /devices page: chart rendering with device data
- [ ] Test site selector: switching between sites
- [ ] Test time range selector: data filtering on change
- [ ] Test loading states: appear during fetch
- [ ] Test error states: API failure handling
- [ ] Test empty states: no data guidance

#### Concurrent Load Test for Dashboard APIs
- [ ] Verify combined API throughput (overview + pages + referrers + devices)
- [ ] Target: ~100 req/s total across all endpoints
- [ ] Ensure stability during multiple UI fetches per user
- [ ] Test with 10+ concurrent users browsing dashboard

#### Edge-Case Tests
- [ ] Site with no pageviews → Empty state renders
- [ ] Large dataset (>100K views) → pagination/performance test
- [ ] Invalid site ID → Error state renders correctly
- [ ] Network timeout → Error with retry button
- [ ] Unauthorized access → Redirect to login
- [ ] Site ownership validation → 404 for non-owned sites

#### Regression Checklist
- [ ] API schema stability (no breaking changes)
- [ ] Component snapshot tests for UI consistency
- [ ] Accessibility checks (ARIA roles, keyboard navigation)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile responsiveness verified
- [ ] All previous phases still working (auth, tracking, ingestion)

**Test Documentation:**
Create `docs/phases/phase-7/PHASE-7-TESTING.md` with:

| Test ID | Category | Description | Expected Result |
|---------|----------|-------------|-----------------|
| T-7-01 | API Auth | Call /api/analytics/* unauthenticated | 401 Unauthorized |
| T-7-02 | API Valid Params | /overview?siteId=valid&timeRange=30d | 200 + correct payload |
| T-7-03 | API Invalid Params | /overview?siteId=invalid | 404 Not Found |
| T-7-04 | Dashboard Performance | Measure load time | < 1 second |
| T-7-05 | Dashboard Error State | Force API failure | Error UI renders |
| T-7-06 | Dashboard Empty State | No data site | Empty UI renders |
| T-7-07 | Site Switching | Change site selector | All cards refresh |
| T-7-08 | Time Range | Switch 7d→30d→90d | Data filters correctly |
| T-7-09 | Real-time Updates | Wait 60 seconds | Dashboard auto-refreshes |
| T-7-10 | Export CSV | Click export button | CSV downloads |
| T-7-11 | Charts Render | Load overview page | Time series chart displays |
| T-7-12 | Concurrent Users | 10 users browse simultaneously | No slowdown |

**Definition of Done:**
- [ ] All time-series charts implemented
- [ ] Real-time updates working (auto-refresh)
- [ ] Custom date range picker functional
- [ ] Export to CSV works
- [ ] All automated tests passing
- [ ] Load tests completed successfully
- [ ] Edge cases handled gracefully
- [ ] Regression suite passes
- [ ] Documentation updated

**Performance Targets:**
- Dashboard load: <1 second (currently: 200-400ms ✅)
- API responses: <200ms (currently: 105-135ms ✅)
- Real-time refresh: Every 60 seconds
- Export generation: <3 seconds
- Chart rendering: <500ms

### Phase 8 – MVP Polish & Deployment

**Status:** 🔜 Planned (November 16–20, 2025)  
**Focus:** Production readiness, onboarding, final QA

**Launch Preparation:**
- [ ] User can sign up and receive welcome email (already working ✅)
- [ ] User can create site and see site ID (already working ✅)
- [ ] User can copy tracking script (already working ✅)
- [ ] User can install script on test site (already working ✅)
- [ ] Pageviews appear in dashboard (already working ✅)
- [ ] All error states display properly (already working ✅)
- [ ] All loading states display properly (already working ✅)

**Polish & Deployment:**
- [ ] Add Sentry error tracking
- [ ] Add error boundaries to React components
- [ ] Create onboarding checklist in dashboard
- [ ] Update landing page with dashboard screenshots
- [ ] Write comprehensive installation guide
- [ ] Deploy to Vercel production
- [ ] Test with real traffic from personal blog/demo site
- [ ] Set up monitoring alerts (Vercel Analytics)
- [ ] Performance audit with Lighthouse (target: 95+ score)

**Final QA:**
- [ ] Works on Chrome, Safari, Firefox (desktop)
- [ ] Works on mobile Safari and Chrome
- [ ] No console errors in browser or server logs
- [ ] User can complete full flow without support
- [ ] Documentation is clear and accurate
- [ ] No critical bugs in production
- [ ] Privacy policy updated
- [ ] Terms of service updated

**Launch Readiness Checklist:**
- [ ] Domain configured (microlytics.app)
- [ ] SSL certificate active
- [ ] Environment variables set in production
- [ ] Database backups configured
- [ ] Email templates tested in production
- [ ] Social media preview images
- [ ] Demo video recorded
- [ ] Launch announcement draft ready

### Post-MVP (Deferred to Phase 9+)

* Stripe billing and subscription tiers
* Weekly reports and login notifications
* Public shareable dashboards
* Advanced custom event tracking

---

## Tech Stack Summary

* **Frontend:** Next.js 15, Tailwind CSS, shadcn/ui
* **Backend:** Next.js API Routes, Prisma ORM
* **Database:** PostgreSQL (Supabase or Railway)
* **Auth:** NextAuth.js (JWT sessions)
* **Emails:** Resend (transactional)
* **Hosting:** Vercel
* **Monitoring:** Sentry

---

## Timeline Overview

```
Week 1 (Oct 7–11):  ✅ Phases 1–2.5 complete (Database + Auth + Emails)
Week 2 (Oct 12):    ✅ Phases 3–6 complete (Tracking + Sites + Ingestion + Dashboard!)
                    🚀 MAJOR ACCELERATION - 4 phases in 1 day!
Week 3 (Nov 4–15):  🔜 Phase 7 - Advanced features & comprehensive testing
Week 4 (Nov 16–20): 🔜 Phase 8 - MVP polish & production deployment
Week 5 (Nov 18–20): 🚀 PUBLIC MVP LAUNCH
```

---

## MVP Launch Criteria

### Core Functionality (All Complete ✅)
- [x] User can create and manage sites
- [x] Tracking script records pageviews successfully
- [x] Data appears on dashboard in under 1 second
- [x] Privacy-compliant (no cookies, masked IPs)
- [x] Onboarding and emails function end-to-end
- [x] Multi-site support with site selector
- [x] Time range filtering (7d/30d/90d)
- [x] Real-time tracking (10,827+ pageviews tracked)

### Remaining for Launch
- [ ] Time-series charts for trends
- [ ] Real-time dashboard updates
- [ ] Export to CSV functionality
- [ ] Comprehensive automated test suite
- [ ] Production deployment to Vercel
- [ ] Performance optimization (Lighthouse 95+)
- [ ] Final QA and cross-browser testing

---

## Post-Launch Objectives

* Collect feedback via form on dashboard
* Monitor usage via Sentry/logs
* Plan billing integration (v2)
* Expand analytics visuals and filters

---

## Technical Decisions

### Site ID Format
**Decision:** Use `cuid2` library  
**Reason:** Short, URL-safe, collision-resistant, sortable by time  
**Implementation:** `import { createId } from '@paralleldrive/cuid2'`

### Rate Limiting
**Decision:** Skip for MVP, add in v1.1  
**Reason:** Premature optimization, Vercel has basic DDoS protection  
**Revisit:** When > 1000 sites or abuse detected

### Tracking Script Hosting
**Decision:** Static file at `/public/m.js`  
**Reason:** Simplest, CDN-cacheable, fast delivery  
**Upgrade Path:** Move to Edge Function if dynamic per-site config needed

### Time Zones
**Decision:** Store all timestamps in UTC, let users set display timezone preference  
**Reason:** Avoids conversion bugs, standard practice  
**Implementation:** Use `date-fns-tz` for display formatting

### User-Agent Parsing
**Decision:** Use `ua-parser-js` library  
**Reason:** Battle-tested, handles edge cases, actively maintained  
**Alternative:** Could build custom parser, but not worth the time

### Database Queries
**Decision:** Use Prisma `groupBy` for aggregations  
**Reason:** Type-safe, readable, good enough for MVP scale  
**Optimization:** Add raw SQL if performance becomes issue (>100k pageviews/day)

---

## Risk Register

| Risk | Impact | Probability | Mitigation Strategy |
|------|---------|-------------|-------------------|
| Ad blockers block tracking script | High | 50% | Accept 30-50% data loss, document limitation, consider first-party domain |
| Prisma queries too slow | Medium | 30% | Add database indexes, monitor with Prisma Studio, optimize queries |
| Browser compatibility issues | Medium | 20% | Test on Safari/Firefox early, use polyfills, fallback to fetch |
| CORS errors from different domains | Low | 20% | Configure CORS properly, test with multiple domains early |
| Time zone calculation bugs | Medium | 40% | Store UTC only, let users choose display timezone, use tested library |
| Tracking script errors crash page | Low | 10% | Wrap in try-catch, fail silently, don't block page load |
| Database performance with large data | Medium | 30% | Add indexes on (siteId, timestamp), implement pagination |
| Users don't understand how to install | High | 40% | Clear documentation, onboarding checklist, video tutorial |

---

## Changelog

### v2.2 - Oct 12, 2025 (Major Progress Update - Phases 3-6 Complete!)
* ✅ Marked Phases 3-6 as complete (massive acceleration!)
* ✅ Updated all phase statuses with completion dates
* ✅ Added comprehensive testing plan to Phase 7
* ✅ Reorganized Phase 7 to include advanced features + testing suite
* ✅ Updated Phase 8 with detailed launch preparation checklist
* ✅ Revised timeline to reflect actual progress (68% complete)
* ✅ Added performance metrics from Phases 5 & 6
* 🎉 Project now 68% complete vs 33% yesterday (35% gain in 1 day!)

### v2.1 - Oct 11, 2025 (Detailed Refinements)
* Added "Definition of Done" checklists for each phase
* Added Technical Decisions section with specific implementation choices
* Added Risk Register with mitigation strategies
* Expanded Phase 7 with concrete testing checklist
* Added performance benchmarks and browser testing requirements
* Clarified technical implementation details for each phase

### v2.0 - Oct 11, 2025 (Build Order Fix)
* Reordered build sequence based on dependency analysis
* Moved Site Management (Phase 3) before Tracking Script
* Adjusted all target dates and dependencies accordingly
* Updated descriptions for clarity and testability
* Maintained completed phases and roadmap format
