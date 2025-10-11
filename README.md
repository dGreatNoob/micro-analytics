# 🚀 Microlytics

**Privacy-First Website Analytics Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

Beautiful, simple, privacy-first analytics for your websites. No cookies, no tracking bloat, GDPR compliant.

---

## ✅ Current Status

**Progress:** Phase 2 Complete (31%)

- ✅ **Landing Page** - Fully animated with smooth scrolling
- ✅ **Database** - PostgreSQL + Prisma + Docker
- ✅ **Authentication** - Google & GitHub OAuth
- ✅ **Welcome Emails** - Resend integration
- ✅ **Dashboard** - Protected routes
- ⏳ **Tracking Script** - Coming next (Phase 3)
- ⏸️ **Analytics** - Not yet implemented

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
- [`docs/EMAIL-QUICK-START.md`](docs/EMAIL-QUICK-START.md) - Email setup (5 min)
- [`docs/DOCKER-SETUP.md`](docs/DOCKER-SETUP.md) - Database guide
- [`docs/AUTH-SETUP.md`](docs/AUTH-SETUP.md) - OAuth credentials

**Development:**
- [`docs/ROADMAP.md`](docs/ROADMAP.md) - Master development plan
- [`docs/PROGRESS-SUMMARY.md`](docs/PROGRESS-SUMMARY.md) - Current status
- [`docs/EMAIL-NOTIFICATIONS.md`](docs/EMAIL-NOTIFICATIONS.md) - Email system

**Completed Phases:**
- [`docs/SETUP-COMPLETE.md`](docs/SETUP-COMPLETE.md) - Phase 1
- [`docs/PHASE-2-COMPLETE.md`](docs/PHASE-2-COMPLETE.md) - Phase 2

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
- Modern landing page with animations
- User authentication (Google, GitHub)
- Welcome email notifications
- Protected dashboard
- Database with test data
- Docker development environment

### 🚧 In Development
- Analytics tracking script
- Event ingestion API
- Real-time dashboard
- Site management
- Subscription billing

---

## 📊 Project Stats

- **63** TypeScript/TSX files
- **25** React components  
- **13** Documentation guides
- **7** Database tables
- **100+** Sample analytics records

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
- Read next phase: [`docs/ROADMAP.md`](docs/ROADMAP.md) → Phase 3

---

**Built with ❤️ using Next.js, Prisma, and shadcn/ui**
