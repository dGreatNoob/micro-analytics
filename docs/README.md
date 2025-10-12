# 📚 Microlytics Documentation

**Last Updated:** October 12, 2025  
**Project Status:** 50% Complete (Phase 4 Done, Phase 5 Next)

---

## 📖 Quick Links

| Document | Description | When to Use |
|----------|-------------|-------------|
| [ROADMAP_V2.md](planning/ROADMAP_V2.md) | Master development plan | Understanding project scope |
| [PROGRESS-SUMMARY.md](planning/PROGRESS-SUMMARY.md) | Current status & completed work | Checking what's done |
| [GETTING-STARTED.md](GETTING-STARTED.md) | Local development setup | First time setup |
| [DOCKER-SETUP.md](DOCKER-SETUP.md) | Database configuration | Database issues |
| [AUTH-SETUP.md](AUTH-SETUP.md) | OAuth configuration | Setting up authentication |

---

## 📁 Documentation Structure

```
docs/
├── README.md (you are here)
│
├── planning/                    # Project Planning
│   ├── ROADMAP_V2.md           # Master roadmap (authoritative)
│   ├── PROGRESS-SUMMARY.md     # Progress tracker
│   └── roadmap_old.md          # Legacy roadmap
│
├── phases/                      # Phase-Specific Documentation
│   ├── README.md               # Phases overview
│   ├── phase-3/                # Site Management
│   │   ├── PHASE-3-COMPLETE.md
│   │   └── TEST-PHASE-3.md
│   └── phase-4/                # Tracking Script
│       ├── PHASE-4-COMPLETE.md      # Full summary
│       ├── PHASE-4-QUICKSTART.md    # Quick start
│       ├── TEST-PHASE-4.md          # Testing guide
│       └── SOLO-TEST-GUIDE.md       # Solo dev testing
│
├── deployment/                  # Deployment Guides
│   ├── DEPLOYMENT_GUIDE.md     # Production deployment
│   └── EMAIL-NOTIFICATIONS.md  # Email setup guide
│
├── troubleshoots/              # Troubleshooting
│   ├── AUTH-DIAGNOSIS.md       # Auth debugging
│   ├── EMAIL-QUICK-START.md    # Email setup
│   └── SIGNIN-FIXES-SUMMARY.md # Sign-in issues
│
├── GETTING-STARTED.md          # Local setup guide
├── DOCKER-SETUP.md             # Docker & database
└── AUTH-SETUP.md               # OAuth configuration
```

---

## 🚀 Quick Start

### New Developer Setup

1. **Clone and setup:**
   ```bash
   git clone <repo>
   cd micro-analytics
   npm install
   ```

2. **Start database:**
   ```bash
   make db-up
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Add your credentials
   ```

4. **Start dev server:**
   ```bash
   npm run dev
   ```

5. **Read documentation:**
   - [GETTING-STARTED.md](GETTING-STARTED.md) - Full setup guide
   - [PROGRESS-SUMMARY.md](planning/PROGRESS-SUMMARY.md) - What works now

---

## 📋 By Use Case

### "I want to understand the project"
→ Read [ROADMAP_V2.md](planning/ROADMAP_V2.md)

### "I want to see what's completed"
→ Read [PROGRESS-SUMMARY.md](planning/PROGRESS-SUMMARY.md)

### "I want to set up my local environment"
→ Read [GETTING-STARTED.md](GETTING-STARTED.md)

### "I'm having authentication issues"
→ Read [troubleshoots/AUTH-DIAGNOSIS.md](troubleshoots/AUTH-DIAGNOSIS.md)

### "I want to test the tracking script"
→ Read [phases/phase-4/SOLO-TEST-GUIDE.md](phases/phase-4/SOLO-TEST-GUIDE.md)

### "I want to deploy to production"
→ Read [deployment/DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)

### "I want to configure email"
→ Read [troubleshoots/EMAIL-QUICK-START.md](troubleshoots/EMAIL-QUICK-START.md)

---

## ✅ Current Status (Phase 4 Complete)

**Working Features:**
- ✅ Authentication (Google, GitHub, Email/Password)
- ✅ Welcome emails (Resend)
- ✅ Site management (CRUD operations)
- ✅ Tracking script (privacy-first, <2KB)
- ✅ Pageview tracking (logs only, Phase 5 will add DB storage)

**Next Phase:**
- 🔜 Phase 5: Data Ingestion API (database storage, device detection)

---

## 🎯 Documentation Guidelines

### For Contributors

When adding documentation:

1. **General guides** → `/docs/` root
2. **Phase-specific** → `/docs/phases/phase-X/`
3. **Troubleshooting** → `/docs/troubleshoots/`
4. **Deployment** → `/docs/deployment/`
5. **Planning** → `/docs/planning/`

### Documentation Standards

- Use clear, descriptive titles
- Include "Last Updated" date
- Add table of contents for long docs
- Use code blocks with language tags
- Include examples where helpful
- Keep tone concise and actionable

---

## 📞 Getting Help

1. **Check documentation** - Browse this folder structure
2. **Search issues** - Check existing troubleshooting docs
3. **Check logs** - Use `make logs` for Docker logs
4. **Database issues** - Use `npx prisma studio`
5. **Build errors** - Run `npm run build` to see details

---

## 🔗 External Resources

- **Next.js 15 Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth.js v5:** https://authjs.dev
- **Resend Docs:** https://resend.com/docs
- **shadcn/ui:** https://ui.shadcn.com

---

**Last Updated:** October 12, 2025  
**Phase:** 4 of 8 Complete (50%)  
**Next Milestone:** Phase 5 - Data Ingestion API
