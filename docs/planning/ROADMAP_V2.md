# Microlytics Roadmap v2

**Status:** Updated October 11, 2025  
**Author:** Belteshazzar Marquez  
**Scope:** Lean MVP for public launch (solo developer)

---

## Overview
This roadmap replaces the original version to better match current progress and development capacity. It focuses on delivering a complete, functional MVP that demonstrates the full data loop:

> User creates site → installs tracking script → data is collected → analytics appear on dashboard.

---

## Phase Summary

| Phase | Name | Status | Target Dates | Description |
|-------|------|--------|---------------|-------------|
| 1 | Database Foundation | ✅ Complete | Oct 7 | PostgreSQL, Prisma schema, migrations, seeding. |
| 2 | Authentication System | ✅ Complete | Oct 9 | NextAuth.js with Google, GitHub, and credentials. |
| 2.1 | Authentication Fixes | ✅ Complete | Oct 11 | JWT sessions implemented and tested. |
| 2.5 | Welcome Emails | ✅ Complete | Oct 11 | Resend integration and welcome email system. |
| 3 | Tracking Script | ⏳ In Progress | Oct 14–20 | Lightweight `m.js` script to capture pageviews and events. |
| 4 | Data Ingestion API | ⏳ Pending | Oct 21–26 | `/api/track` endpoint for pageview storage, validation, and device parsing. |
| 5 | Dashboard Data Layer | 🔜 Planned | Oct 27–Nov 3 | Query APIs for pageviews, referrers, devices, and countries. |
| 6 | Site Management | 🔜 Planned | Nov 4–9 | UI to create sites, view site ID, and manage settings. |
| 7 | MVP Launch & Testing | 🔜 Planned | Nov 10–15 | Final polish, onboarding flow, error handling, deploy to Vercel. |
| 🚀 | Public MVP Launch | 🔜 Goal | Nov 18–20 | Announce launch, share demo, collect feedback. |

---

## Development Details

### Phase 3 – Tracking Script
- Build `public/m.js` (<2KB gzipped)
- Collect: pathname, referrer, timestamp, browser, OS
- Use UUID-based visitor IDs (no cookies)
- Send data via `navigator.sendBeacon()` to `/api/track`
- Test script locally and on marketing site

### Phase 4 – Data Ingestion API
- Create `/api/track` route handler
- Validate incoming requests (required fields, rate limit)
- Parse `User-Agent` for browser/device data
- Store pageviews in PostgreSQL
- Mask IP (last octet)
- Add logging and error handling

### Phase 5 – Dashboard Data Layer
- Create analytics endpoints:
  - `/api/analytics/overview`
  - `/api/analytics/pages`
  - `/api/analytics/referrers`
  - `/api/analytics/devices`
- Implement aggregation queries using Prisma `groupBy`
- Use Recharts for basic visualizations
- Add loading and empty states

### Phase 6 – Site Management
- Add dashboard section for site creation and management
- Generate and display tracking snippet
- Support edit and delete actions
- Verify site installation (basic check)

### Phase 7 – MVP Launch Preparation
- Review error boundaries and logging (Sentry)
- Create onboarding checklist (create site → install script → view data)
- Update landing page and docs
- Test with real traffic from blog or demo site

### Post-MVP (Deferred)
- Stripe billing and subscription tiers
- Weekly reports and security notifications
- Public shareable dashboards
- Advanced event tracking

---

## Tech Stack Summary
- **Frontend:** Next.js 15, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase or Railway)
- **Auth:** NextAuth.js (JWT sessions)
- **Emails:** Resend (transactional)
- **Hosting:** Vercel
- **Monitoring:** Sentry

---

## Timeline Overview
```
Week 1 (Oct 7–11): Phases 1–2.5 complete
Week 2 (Oct 14–20): Build tracking script
Week 3 (Oct 21–26): Implement data ingestion
Week 4 (Oct 27–Nov 3): Dashboard data layer
Week 5 (Nov 4–9): Site management
Week 6 (Nov 10–15): Final testing & deployment
Week 7 (Nov 18–20): Public MVP launch
```

---

## MVP Launch Criteria
- User can create a site
- Tracking script records pageviews
- Data appears on dashboard
- Dashboard loads in <1s
- System is privacy-compliant and cookie-free
- Welcome email and onboarding work end-to-end

---

## Post-Launch Objectives
- Collect feedback (Google Form link on dashboard)
- Monitor usage via logs and Sentry
- Prepare for billing integration (v2)
- Expand dashboard visuals and filters

---

## Changelog
- **Rewritten:** Oct 11, 2025
- **Purpose:** Simplified roadmap aligned with solo developer progress
- **Changes:**
  - Removed redundant advanced phases (emails, billing, events)
  - Consolidated Phases 3–5 into executable vertical slices
  - Added realistic dates and MVP launch milestone
  - Marked completed phases with ✅
  - Streamlined for GitHub documentation

