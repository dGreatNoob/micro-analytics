# My startup Saas idea born from a long series of homesickness, boredome and the strong desire to be rich lmao. 

# this project's been on hold for 2 weeks bc of work deadlines. will get back to this soon!

**Privacy-First Website Analytics Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

Beautiful, simple, privacy-first analytics for your websites. No cookies, no tracking bloat, GDPR compliant.

---

## ✅ Current Status

**Progress:** Phase 6 In Progress (68%) - Analytics APIs Ready! 🚀

- ✅ **Landing Page** - Smooth animations & modern UI
- ✅ **Database** - PostgreSQL + Prisma + Docker
- ✅ **Authentication** - Google, GitHub & Email/Password (JWT sessions)
- ✅ **Welcome Emails** - Resend integration with HTML templates
- ✅ **Tracking Script** - Lightweight, privacy-first (m.js)
- ✅ **Data Ingestion API** - High-performance, stress-tested to 100 req/s
- ✅ **Site Management** - CRUD APIs for user sites
- ✅ **Analytics APIs** - Overview, Pages, Referrers, Devices endpoints
- ⏳ **Dashboard UI** - API integration in progress (Phase 6)
- ⏸️ **Billing & Subscriptions** - Planned for Phase 7

### Recent Achievements (Oct 12, 2025)
- ✅ Phase 5 Complete: Data Ingestion API (10,922 pageviews tracked!)
- ✅ Performance optimized: 40ms avg response time, <100ms P95
- ✅ Site caching & async writes for scalability
- ✅ Phase 6 APIs: 4 analytics endpoints created & tested
- 🎯 Next: Connect dashboard UI to show real analytics data

📖 See [PROGRESS-SUMMARY.md](./docs/planning/PROGRESS-SUMMARY.md) for complete timeline.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Setup (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/your-org/micro-analytics
cd micro-analytics

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment
cp .env.example .env
# Edit .env with your credentials

# 4. Start database & run migrations
make setup

# 5. Start development server
make dev
```

Visit http://localhost:3000 🎉

---

## 📚 Documentation

**Quick Guides:**
- [`docs/GETTING-STARTED.md`](docs/GETTING-STARTED.md) - Initial setup
- [`docs/DOCKER-SETUP.md`](docs/DOCKER-SETUP.md) - Database guide
- [`docs/AUTH-SETUP.md`](docs/AUTH-SETUP.md) - OAuth credentials
- [`docs/EMAIL-QUICK-START.md`](docs/EMAIL-QUICK-START.md) - Email setup (5 min)

**Development:**
- [`docs/planning/ROADMAP_V2.md`](docs/planning/ROADMAP_V2.md) - Master development plan
- [`docs/planning/PROGRESS-SUMMARY.md`](docs/planning/PROGRESS-SUMMARY.md) - Current status (68%)
- [`docs/deployment/EMAIL-NOTIFICATIONS.md`](docs/deployment/EMAIL-NOTIFICATIONS.md) - Email system

**Phase Documentation:**
- [`docs/phases/phase-5/PHASE-5-COMPLETE.md`](docs/phases/phase-5/PHASE-5-COMPLETE.md) - Data Ingestion
- [`docs/phases/phase-5/STRESS-TEST-RESULTS.md`](docs/phases/phase-5/STRESS-TEST-RESULTS.md) - Performance tests
- [`docs/phases/phase-5/FINAL-ASSESSMENT.md`](docs/phases/phase-5/FINAL-ASSESSMENT.md) - Phase 5 verdict

**Testing:**
- [`public/test/index.html`](public/test/index.html) - Live tracking test page
- [`public/test/TEST-FILES-README.md`](public/test/TEST-FILES-README.md) - Testing guide

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Fonts:** Geist Sans & Mono

### Backend
- **Database:** PostgreSQL 16
- **ORM:** Prisma 6
- **Auth:** NextAuth.js v5
- **Email:** Resend
- **Cache:** Redis (optional)

### Infrastructure
- **Hosting:** Vercel (planned)
- **Database:** Docker (dev) / Neon (prod)
- **CDN:** Cloudflare (planned)

---

## 📋 Development Commands

### Database
```bash
make db-up        # Start PostgreSQL
make db-down      # Stop containers
make db-seed      # Add test data
make studio       # Open Prisma Studio
```

### Development
```bash
make dev          # Start Next.js dev server
make build        # Build for production
make lint         # Run ESLint
```

### Utilities
```bash
make logs         # View Docker logs
make db-backup    # Backup database
make clean        # Remove everything
```

---

## 🔑 Environment Variables

Required in `.env`:

```env
# Database (Docker)
DATABASE_URL="postgresql://microlytics:microlytics_dev_password@localhost:5432/microlytics_dev"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth (get from providers)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Email (get from Resend)
RESEND_API_KEY=""
EMAIL_FROM="Microlytics <noreply@microlytics.app>"
```

See `.env.example` for complete list.

---

## 🎯 Features

### ✅ Implemented
- **Landing Page:** Modern UI with animations & section navigation
- **Authentication:** Google, GitHub, Email/Password (JWT sessions)
- **Welcome Emails:** Resend integration with HTML templates
- **Tracking Script:** Lightweight m.js (privacy-first, no cookies)
- **Data Ingestion:** High-performance `/api/track` endpoint
- **Site Management:** Full CRUD APIs for managing sites
- **Analytics APIs:** Overview, Pages, Referrers, Devices endpoints
- **Database:** PostgreSQL + Prisma with optimized indexes
- **Docker Environment:** One-command setup with `make dev`

### 🚧 In Development
- **Dashboard UI Integration** - Connecting pages to analytics APIs
- **Real-time Data Display** - Charts & visualizations
- **Time Range Filtering** - 7/30/90 day views

### 📅 Planned
- **Subscription Billing** - Stripe integration (Phase 7)
- **Team Management** - Multi-user access (Phase 8)
- **Custom Events** - Track specific user actions (Phase 9)

---

## 📊 Project Stats

- **80+** TypeScript/TSX files
- **30+** React components  
- **20+** Documentation guides
- **7** Database tables (User, Site, Pageview, Event, etc.)
- **10,922** Real pageviews tracked & stored
- **100 req/s** API performance (stress-tested)

---

## 🤝 Contributing

This is currently a private project in active development.

---

## 📄 License

Proprietary - All rights reserved

---

## 🎉 Getting Started

**First time here?**
1. Read [`docs/ROADMAP.md`](docs/ROADMAP.md) - Understand the vision
2. Run `make setup` - Get everything installed
3. Read [`docs/PROGRESS-SUMMARY.md`](docs/PROGRESS-SUMMARY.md) - See what's done

**Ready to code?**
- Start dev server: `make dev`
- View database: `npx prisma studio`
- Test tracking: Open http://localhost:3000/test/index.html
- Read roadmap: [`docs/planning/ROADMAP_V2.md`](docs/planning/ROADMAP_V2.md)

---

**Built with ❤️ using Next.js, Prisma, and shadcn/ui**
