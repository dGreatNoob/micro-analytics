# Microlytics Roadmap v2 (Updated Build Order)

**Status:** Updated October 11, 2025
**Author:** Belteshazzar Marquez
**Scope:** Lean MVP for public launch (solo developer)

---

## Overview

This version corrects the development order based on system dependencies identified during analysis. The new order prioritizes completing the core vertical slice first:

> User creates site → installs tracking script → data is collected → analytics appear on dashboard.

This ensures an end-to-end working loop before expanding features.

---

## Phase Summary

| Phase | Name                  | Status        | Target Dates | Description                                                        |
| ----- | --------------------- | ------------- | ------------ | ------------------------------------------------------------------ |
| 1     | Database Foundation   | ✅ Complete    | Oct 7        | PostgreSQL, Prisma schema, migrations, seeding.                    |
| 2     | Authentication System | ✅ Complete    | Oct 9        | NextAuth.js with Google, GitHub, and credentials.                  |
| 2.1   | Authentication Fixes  | ✅ Complete    | Oct 11       | JWT sessions implemented and tested.                               |
| 2.5   | Welcome Emails        | ✅ Complete    | Oct 11       | Resend integration and welcome email system.                       |
| 3     | Site Management       | ⏳ In Progress | Oct 14–20    | Enable users to create/manage sites and generate tracking IDs.     |
| 4     | Tracking Script       | 🔜 Planned    | Oct 21–25    | Build lightweight `m.js` script to capture pageviews and events.   |
| 5     | Data Ingestion API    | 🔜 Planned    | Oct 26–31    | `/api/track` endpoint for validation, storage, and device parsing. |
| 6     | Dashboard Data Layer  | 🔜 Planned    | Nov 1–8      | Query APIs and visualizations for site analytics.                  |
| 7     | MVP Launch & Testing  | 🔜 Planned    | Nov 9–20     | Final polish, onboarding flow, and deployment.                     |
| 🚀    | Public MVP Launch     | 🔜 Goal       | Nov 18–20    | Announce launch, share demo, and collect feedback.                 |

---

## Development Details

### Phase 3 – Site Management

**Core Features:**
* Add `/dashboard/sites` page with sites list
* Create site form (name, domain validation)
* Site details page with tracking script
* Edit site (name, domain, timezone)
* Delete site (with confirmation, cascades to pageviews)

**Definition of Done:**
- [ ] User can create site with name/domain
- [ ] User sees generated site ID
- [ ] User can copy tracking script snippet
- [ ] User can view list of all their sites
- [ ] User can edit site details
- [ ] User can delete site (requires confirmation)
- [ ] All operations show loading states
- [ ] All operations handle errors gracefully
- [ ] Form validation works (domain format, required fields)

**Technical Implementation:**
- API Routes: `POST /api/sites`, `GET /api/sites`, `PATCH /api/sites/[id]`, `DELETE /api/sites/[id]`
- Use `cuid2` for site ID generation
- Store: siteId, name, domain, userId, timezone, createdAt

### Phase 4 – Tracking Script

**Core Features:**
* Build `public/m.js` (<2KB gzipped)
* Collect: pathname, referrer, timestamp, browser, OS, device
* Generate visitor IDs (no cookies, daily rotation)
* Send data via `navigator.sendBeacon()` to `/api/track`
* Handle errors gracefully (network failures, blocked requests)

**Definition of Done:**
- [ ] Script loads and executes without errors
- [ ] Captures pageview on page load
- [ ] Sends data to /api/track with site ID
- [ ] Works in Chrome, Safari, Firefox
- [ ] Works on mobile browsers
- [ ] Handles network failures gracefully
- [ ] Script size <2KB minified + gzipped
- [ ] No console errors in browser
- [ ] Respects Do Not Track (optional)

**Technical Implementation:**
- Static file at `/public/m.js`
- Use `navigator.sendBeacon()` for reliability
- Fallback to `fetch()` if beacon unavailable
- Generate visitor ID from canvas fingerprint + date
- Minify with esbuild or terser

### Phase 5 – Data Ingestion API

**Core Features:**
* Create `/api/track` POST endpoint
* Validate incoming requests (site ID exists, valid payload)
* Parse `User-Agent` for browser/device/OS info
* Store pageviews in PostgreSQL
* Mask IP addresses (remove last octet)
* Add error logging

**Definition of Done:**
- [ ] Endpoint accepts POST requests
- [ ] Validates site ID exists in database
- [ ] Rejects invalid/malformed requests
- [ ] Parses User-Agent correctly (use `ua-parser-js` library)
- [ ] Stores pageview with all required fields
- [ ] IP masking works (127.0.0.x → 127.0.0.0)
- [ ] Returns 200 on success, 400/404 on errors
- [ ] Logs errors to console
- [ ] Responds in <100ms (measured)
- [ ] Can handle 100 requests/second (stress test)

**Technical Implementation:**
- Edge Runtime for low latency
- Use `ua-parser-js` for User-Agent parsing
- Skip rate limiting for MVP (revisit at 1000+ sites)
- Schema: siteId, pathname, referrer, visitorId, country, device, browser, os, timestamp

### Phase 6 – Dashboard Data Layer

**Core Features:**
* Create analytics API endpoints with date filtering
* Implement aggregation queries using Prisma `groupBy`
* Connect dashboard UI to real data (replace dummy data)
* Add loading states, error states, empty states
* Optimize query performance

**API Endpoints:**
- `GET /api/analytics/overview?siteId=xxx&start=xxx&end=xxx`
  - Returns: total pageviews, unique visitors, avg time, bounce rate
- `GET /api/analytics/pages?siteId=xxx&start=xxx&end=xxx`
  - Returns: top pages with views, unique visitors
- `GET /api/analytics/referrers?siteId=xxx&start=xxx&end=xxx`
  - Returns: top referrers with counts
- `GET /api/analytics/devices?siteId=xxx&start=xxx&end=xxx`
  - Returns: device/browser/OS breakdown

**Definition of Done:**
- [ ] All 4 endpoints return correct data
- [ ] Date filtering works (last 7/30/90 days)
- [ ] Queries are optimized (use indexes, explain analyze)
- [ ] Dashboard shows real data from database
- [ ] Loading states display while fetching
- [ ] Error states handle API failures
- [ ] Empty states show when no data
- [ ] Dashboard loads in <1 second (with 1000 pageviews)
- [ ] Time zones handled correctly (store UTC, display user timezone)
- [ ] Pagination works for large datasets (>1000 pages)

**Technical Implementation:**
- Use Prisma `groupBy` for aggregations
- Add database indexes on (siteId, timestamp)
- Cache results for 5 minutes (optional optimization)
- Use date-fns for date manipulation

### Phase 7 – MVP Launch Preparation

**Testing Checklist:**
- [ ] User can sign up and receive welcome email
- [ ] User can create site and see site ID
- [ ] User can copy tracking script
- [ ] User can install script on test site
- [ ] Pageviews appear in database within seconds
- [ ] Dashboard shows correct pageview counts
- [ ] Date filters work correctly
- [ ] User can delete site and all data
- [ ] Works on Chrome, Safari, Firefox (desktop)
- [ ] Works on mobile Safari and Chrome
- [ ] All error states display properly
- [ ] All loading states display properly
- [ ] No console errors in browser or server logs

**Performance Benchmarks:**
- [ ] Dashboard loads in <1 second
- [ ] /api/track responds in <100ms
- [ ] Tracking script loads in <500ms
- [ ] Can handle 100 concurrent pageviews

**Polish & Deployment:**
- [ ] Add Sentry error tracking
- [ ] Add error boundaries to React components
- [ ] Create onboarding checklist in dashboard
- [ ] Update landing page with screenshots
- [ ] Write installation guide
- [ ] Deploy to Vercel production
- [ ] Test with real traffic from blog/demo site
- [ ] Set up monitoring alerts

**Launch Readiness:**
- [ ] User can complete full flow without support
- [ ] Documentation is clear and accurate
- [ ] No critical bugs in production
- [ ] Privacy policy updated
- [ ] Terms of service updated

### Post-MVP (Deferred)

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
Week 1 (Oct 7–11): Phases 1–2.5 complete
Week 2 (Oct 14–20): Build site management module
Week 3 (Oct 21–25): Implement tracking script
Week 4 (Oct 26–31): Develop data ingestion API
Week 5 (Nov 1–8): Create dashboard data layer
Week 6 (Nov 9–15): Testing, onboarding, and polish
Week 7 (Nov 18–20): Public MVP launch
```

---

## MVP Launch Criteria

* User can create and manage sites
* Tracking script records pageviews successfully
* Data appears on dashboard in under 1s
* Privacy-compliant (no cookies, masked IPs)
* Onboarding and emails function end-to-end

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
