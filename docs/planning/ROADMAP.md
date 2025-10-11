# Microlytics Development Roadmap

**Status:** Landing Page ✅ | Dashboard UI ✅ | Backend 🚧

---

## 🎯 Project Overview

Microlytics is a privacy-first, GDPR-compliant analytics platform that provides simple, beautiful insights without tracking bloat.

**Current State:**
- ✅ Landing page with smooth animations
- ✅ Dashboard UI components
- ⏳ Database schema design
- ⏳ Authentication system
- ⏳ Analytics tracking script
- ⏳ Data ingestion pipeline

---

## 📋 Development Phases

### **Phase 1: Database Foundation** (Week 1-2)
*Priority: HIGH | Status: NOT STARTED*

#### 1.1 Choose Database Stack
**Decision Points:**
- **PostgreSQL + Prisma** (Recommended)
  - Type-safe queries
  - Easy migrations
  - Great DX with Prisma Studio
  - Works well with Vercel
  
- **PostgreSQL + Drizzle**
  - Lighter weight
  - SQL-first approach
  - Better performance
  
- **Supabase** (All-in-one)
  - Includes auth + database
  - Real-time subscriptions
  - Hosted solution

**Recommendation:** Start with **PostgreSQL + Prisma** for rapid development.

#### 1.2 Schema Design

**Core Tables:**

```prisma
// User Management
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sites         Site[]
  accounts      Account[]
  sessions      Session[]
}

// Tracked Websites
model Site {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name        String
  domain      String
  siteId      String   @unique // Public tracking ID
  timezone    String   @default("UTC")
  isPublic    Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  events      Event[]
  pageviews   Pageview[]
}

// Analytics Events (Pageviews, Custom Events)
model Pageview {
  id          String   @id @default(cuid())
  siteId      String
  site        Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  
  // Page Information
  pathname    String
  referrer    String?
  
  // Visitor Information (anonymized)
  visitorId   String   // Hashed daily rotating ID
  country     String?
  device      String?
  browser     String?
  os          String?
  
  // Timing
  timestamp   DateTime @default(now())
  duration    Int?     // Time on page (ms)
  
  @@index([siteId, timestamp])
  @@index([visitorId, timestamp])
}

model Event {
  id          String   @id @default(cuid())
  siteId      String
  site        Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  
  name        String   // Event name (e.g., "signup", "purchase")
  properties  Json?    // Custom event properties
  
  visitorId   String
  timestamp   DateTime @default(now())
  
  @@index([siteId, timestamp])
  @@index([name, timestamp])
}

// NextAuth.js tables
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

#### 1.3 Database Setup Tasks

- [ ] Install Prisma: `npm install prisma @prisma/client`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Create schema in `prisma/schema.prisma`
- [ ] Set up PostgreSQL (local or Supabase/Neon/Railway)
- [ ] Configure `.env` with `DATABASE_URL`
- [ ] Run initial migration: `npx prisma migrate dev --name init`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Seed database with test data

**Estimated Time:** 3-4 days

---

### **Phase 2: Authentication System** (Week 2-3)
*Priority: HIGH | Status: ✅ COMPLETE*

#### 2.1 Choose Auth Provider

**Options:**

1. **NextAuth.js** (Recommended)
   - Open source, fully customizable
   - Works with your Prisma schema
   - Supports multiple providers (Google, GitHub, Email)
   - Session management built-in

2. **Clerk**
   - Fastest to implement
   - Beautiful UI components
   - User management dashboard
   - Costs money after free tier

3. **Supabase Auth**
   - Integrated with Supabase DB
   - Row-level security
   - Magic links, OAuth

**Recommendation:** **NextAuth.js** for flexibility and cost-effectiveness.

#### 2.2 Auth Implementation Tasks

- [ ] Install NextAuth: `npm install next-auth`
- [ ] Create `/app/api/auth/[...nextauth]/route.ts`
- [ ] Configure providers (Google, GitHub, Email)
- [ ] Set up Prisma adapter
- [ ] Create auth middleware for protected routes
- [ ] Build sign-in/sign-up pages
- [ ] Implement email verification
- [ ] Add session management
- [ ] Create user profile page
- [ ] Add logout functionality

#### 2.3 Protected Routes

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/api/analytics/:path*']
}
```

**Estimated Time:** 4-5 days ✅

#### 2.4 Email Notifications (Bonus)

- [x] Install Resend email service
- [x] Create welcome email template
- [x] Integrate with auth callback
- [x] Add email configuration
- [ ] Get Resend API key (5 min)
- [ ] Test welcome emails

**Estimated Time:** 30 minutes

---

### **Phase 3: Analytics Tracking Script** (Week 3-4)
*Priority: HIGH | Status: NOT STARTED*

#### 3.1 Create Tracking Script (`public/m.js`)

**Requirements:**
- < 2KB gzipped
- No cookies
- GDPR compliant
- Tracks pageviews automatically
- Custom events API

**Core Functionality:**

```javascript
// public/m.js (minified in production)
(function() {
  const API_ENDPOINT = 'https://microlytics.app/api/track';
  const siteId = document.currentScript.getAttribute('data-site');
  
  // Generate daily rotating visitor ID (privacy-first)
  function getVisitorId() {
    const date = new Date().toDateString();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Use canvas fingerprint + date for daily rotating ID
    // ... implementation
  }
  
  // Track pageview
  function trackPageview() {
    const data = {
      siteId,
      pathname: window.location.pathname,
      referrer: document.referrer,
      visitorId: getVisitorId(),
      // Device/browser info from navigator
    };
    
    navigator.sendBeacon(API_ENDPOINT, JSON.stringify(data));
  }
  
  // Custom events API
  window.microlytics = {
    track: (eventName, properties) => {
      // Send custom event
    }
  };
  
  // Track initial pageview
  trackPageview();
  
  // Track SPA navigation
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      trackPageview();
    }
  }, 100);
})();
```

#### 3.2 Tasks

- [ ] Create tracking script skeleton
- [ ] Implement visitor ID generation (privacy-preserving)
- [ ] Add device/browser detection
- [ ] Implement pageview tracking
- [ ] Add custom events API
- [ ] Add SPA navigation detection
- [ ] Minify script with esbuild/terser
- [ ] Test on sample websites
- [ ] Create npm package (optional)

**Estimated Time:** 5-6 days

---

### **Phase 4: Data Ingestion API** (Week 4-5)
*Priority: HIGH | Status: NOT STARTED*

#### 4.1 Event Ingestion Endpoint

```typescript
// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { siteId, pathname, referrer, visitorId } = body
    
    // Verify siteId exists
    const site = await prisma.site.findUnique({
      where: { siteId }
    })
    
    if (!site) {
      return NextResponse.json({ error: 'Invalid site' }, { status: 400 })
    }
    
    // Extract device info from User-Agent
    const headersList = headers()
    const userAgent = headersList.get('user-agent')
    const country = headersList.get('cf-ipcountry') // Cloudflare header
    
    // Parse user agent
    const deviceInfo = parseUserAgent(userAgent)
    
    // Store pageview
    await prisma.pageview.create({
      data: {
        siteId: site.id,
        pathname,
        referrer,
        visitorId,
        country,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'edge' // Use Edge runtime for fast responses
```

#### 4.2 Tasks

- [ ] Create `/api/track` endpoint
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Parse User-Agent for device info
- [ ] Add geolocation (IP → country)
- [ ] Set up CORS properly
- [ ] Add error logging
- [ ] Optimize for high throughput
- [ ] Deploy to Edge runtime
- [ ] Add monitoring/alerts

**Estimated Time:** 4-5 days

---

### **Phase 5: Dashboard Data Layer** (Week 5-6)
*Priority: MEDIUM | Status: NOT STARTED*

#### 5.1 Analytics Query APIs

**Endpoints to Create:**

1. **GET /api/analytics/overview**
   - Total pageviews
   - Unique visitors
   - Bounce rate
   - Average session duration

2. **GET /api/analytics/pages**
   - Top pages by views
   - Entry pages
   - Exit pages

3. **GET /api/analytics/referrers**
   - Traffic sources
   - Social media referrals
   - Direct traffic

4. **GET /api/analytics/devices**
   - Device breakdown
   - Browser distribution
   - OS distribution

5. **GET /api/analytics/countries**
   - Geographic distribution

6. **GET /api/analytics/realtime**
   - Current active visitors
   - Recent pageviews

#### 5.2 Query Optimization

```typescript
// Example optimized query
async function getTopPages(siteId: string, startDate: Date, endDate: Date) {
  const pages = await prisma.pageview.groupBy({
    by: ['pathname'],
    where: {
      siteId,
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 10
  })
  
  return pages.map(p => ({
    path: p.pathname,
    views: p._count.id
  }))
}
```

#### 5.3 Tasks

- [ ] Create analytics API endpoints
- [ ] Implement query functions
- [ ] Add caching layer (Redis/Upstash)
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Connect to dashboard components
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Test with real data
- [ ] Add data export (CSV)

**Estimated Time:** 6-7 days

---

### **Phase 6: Site Management** (Week 6-7)
*Priority: MEDIUM | Status: NOT STARTED*

#### 6.1 Features

- [ ] Create new site form
- [ ] Generate unique site ID
- [ ] Display tracking script
- [ ] Edit site settings
- [ ] Delete site (with confirmation)
- [ ] Transfer site ownership
- [ ] Site verification (check if script is installed)
- [ ] Public share links

#### 6.2 Onboarding Flow

1. User signs up
2. Create first site wizard
3. Copy tracking script
4. Verify installation
5. Show first pageview celebration 🎉

**Estimated Time:** 4-5 days

---

### **Phase 7: Enhanced Features** (Week 7-8)
*Priority: MEDIUM | Status: NOT STARTED*

#### 7.1 Email Notification System (Advanced)

**Features:**
- Login notifications (new device alerts)
- Security alerts (suspicious activity)
- Weekly analytics reports
- Billing emails
- Onboarding email sequence
- Email preferences management

**Implementation:**

```typescript
// Login notification
await sendLoginNotificationEmail(user.email, user.name, {
  device: 'Chrome on MacOS',
  location: 'San Francisco, CA',
  ip: '192.168.1.1',
  timestamp: new Date()
})

// Weekly report
await sendWeeklyReportEmail(user.email, {
  pageviews: 10234,
  visitors: 3421,
  topPages: [...],
  period: 'last 7 days'
})
```

**Tasks:**

- [ ] Track login history (device, location, IP)
- [ ] Implement login notification emails
- [ ] Create security alert system
- [ ] Build weekly report generator
- [ ] Add email preferences page
- [ ] Implement unsubscribe functionality
- [ ] Set up email analytics tracking
- [ ] Create onboarding email sequence (Day 1, 3, 7, 14, 30)

**Email Types:**
- Login notifications
- Security alerts
- Weekly/monthly reports  
- Account changes
- Billing confirmations
- Feature announcements
- Onboarding tips

**Estimated Time:** 3-4 days

---

### **Phase 8: Billing & Subscription** (Week 8-9)
*Priority: LOW | Status: NOT STARTED*

#### 7.1 Choose Payment Processor

- **Stripe** (Recommended)
- **Lemon Squeezy** (Merchant of record)
- **Paddle**

#### 7.2 Subscription Tiers

- Free: 5K pageviews/month, 1 site
- Pro: 100K pageviews/month, 10 sites, $9/mo
- Business: 500K+ pageviews, unlimited sites, $29/mo

#### 7.3 Tasks

- [ ] Integrate Stripe
- [ ] Create pricing plans
- [ ] Build checkout flow
- [ ] Add subscription management
- [ ] Implement usage tracking
- [ ] Add upgrade prompts
- [ ] Create customer portal
- [ ] Handle webhooks
- [ ] Add billing page
- [ ] Test payment flows

**Estimated Time:** 6-8 days

---

## 🛠️ Tech Stack Summary

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Charts:** Recharts
- **State:** React hooks + Context

### Backend
- **Runtime:** Node.js (Edge functions where possible)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **API:** Next.js Route Handlers

### Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase / Neon / Railway
- **CDN:** Cloudflare (for tracking script)
- **Caching:** Upstash Redis (optional)
- **Monitoring:** Sentry / LogRocket

---

## 📅 Timeline Overview

| Phase | Duration | Status |
|-------|----------|--------|
| Database Foundation | Week 1 | ✅ Complete |
| Authentication + Welcome Emails | Week 1-2 | ✅ Complete |
| Tracking Script | Week 3-4 | 🔴 Not Started |
| Data Ingestion | Week 4-5 | 🔴 Not Started |
| Dashboard Data | Week 5-6 | 🔴 Not Started |
| Site Management | Week 6-7 | 🔴 Not Started |
| Enhanced Features | Week 7-8 | 🔴 Not Started |
| Billing | Week 8-9 | 🔴 Not Started |

**Total Estimated Time:** 7-8 weeks for MVP

---

## 🚀 Quick Start: Next Steps

### ✅ Completed This Week
1. ✅ Set up PostgreSQL database (Docker)
2. ✅ Install Prisma and create schema
3. ✅ Run migrations and seed data
4. ✅ Install NextAuth.js
5. ✅ Create OAuth auth flow (Google + GitHub)
6. ✅ Add welcome email system (Resend)

### 🔜 Coming Next
1. ⏳ Get OAuth credentials (Google, GitHub)
2. ⏳ Get Resend API key
3. ⏳ Test authentication + emails
4. ⏳ Build tracking script (Phase 3)
5. ⏳ Create site management (Phase 6)

### Action Items (Priority Order)
1. **Database Setup** - Start here
2. **Auth Implementation** - Then this
3. **Site Creation Flow** - Enable users to add sites
4. **Tracking Script** - Build the core product
5. **Data Ingestion** - Make tracking work
6. **Dashboard Queries** - Show real data
7. **Polish & Test** - Refine UX
8. **Launch** - Ship to production

---

## 📝 Notes & Considerations

### Privacy & Compliance
- No cookies = no consent banner needed
- Daily rotating visitor IDs = anonymous
- No cross-site tracking
- Data retention policy (6 months default)
- Easy data deletion on user request

### Performance Goals
- < 100ms response time for tracking
- < 2KB tracking script
- < 1s dashboard load time
- Handle 1M+ events/day

### Security
- Rate limit tracking endpoint
- Validate site IDs
- Sanitize user inputs
- Use prepared statements
- Enable CORS properly
- Implement CSP headers

---

**Last Updated:** 2025-10-11
**Next Review:** After Phase 1 completion

