# Migration Inventory - Complete File List

## 📁 Landing Page (`landing-page/`)

### Config Files
- [x] package.json (MERGE with dashboard)
- [x] tsconfig.json (path: `@/* -> ./src/*`)
- [x] next.config.ts (has remotePatterns for images)
- [x] components.json
- [x] eslint.config.mjs
- [x] postcss.config.mjs
- [x] next-env.d.ts

### Source Files (`src/`)

#### App Directory
- [x] app/layout.tsx (root layout)
- [x] app/page.tsx (landing page - MOVE to (marketing)/page.tsx)
- [x] app/globals.css (has: animated-gradient, glass, glow effects)
- [x] app/favicon.ico

#### Components (`src/components/`)
**Marketing Components (10 files):**
- [x] cta.tsx → components/marketing/cta.tsx
- [x] demo-preview.tsx → components/marketing/demo-preview.tsx
- [x] features.tsx → components/marketing/features.tsx
- [x] footer.tsx → components/marketing/footer.tsx
- [x] header.tsx → components/marketing/header.tsx
- [x] hero.tsx → components/marketing/hero.tsx
- [x] how-it-works.tsx → components/marketing/how-it-works.tsx
- [x] pricing.tsx → components/marketing/pricing.tsx
- [x] scroll-to-top.tsx → components/marketing/scroll-to-top.tsx
- [x] testimonials.tsx → components/marketing/testimonials.tsx

**UI Components (3 files):**
- [x] ui/badge.tsx (compare with dashboard version)
- [x] ui/button.tsx (compare with dashboard version)
- [x] ui/card.tsx (compare with dashboard version)

#### Lib
- [x] lib/utils.ts (MERGE with dashboard)

### Public Assets
- [x] developer-working.png (UNIQUE - keep)
- [x] the-creator.png (UNIQUE - keep)
- [x] visionary-leader.png (UNIQUE - keep)
- [x] file.svg (duplicate)
- [x] globe.svg (duplicate)
- [x] next.svg (duplicate)
- [x] vercel.svg (duplicate)
- [x] window.svg (duplicate)

---

## 📁 Dashboard (`web-app/microlytics-app/`)

### Config Files
- [x] package.json (MERGE with landing)
- [x] tsconfig.json (path: `@/* -> ./*`)
- [x] next.config.ts (empty config)
- [x] components.json
- [x] eslint.config.mjs
- [x] postcss.config.mjs
- [x] next-env.d.ts

### Source Files

#### App Directory
- [x] app/layout.tsx (has ThemeProvider)
- [x] app/page.tsx (overview dashboard - MOVE to (dashboard)/dashboard/page.tsx)
- [x] app/globals.css (has: blue/indigo theme)
- [x] app/favicon.ico

**Dashboard Pages (5 subdirectories):**
- [x] app/devices/page.tsx → (dashboard)/dashboard/devices/page.tsx
- [x] app/pages/page.tsx → (dashboard)/dashboard/pages/page.tsx
- [x] app/profile/page.tsx → (dashboard)/dashboard/profile/page.tsx
- [x] app/referrers/page.tsx → (dashboard)/dashboard/referrers/page.tsx
- [x] app/settings/page.tsx → (dashboard)/dashboard/settings/page.tsx

#### Components
**Dashboard Components (3 files):**
- [x] dashboard-layout.tsx → components/dashboard/dashboard-layout.tsx
- [x] stat-card.tsx → components/dashboard/stat-card.tsx
- [x] time-range-selector.tsx → components/dashboard/time-range-selector.tsx

**UI Components (7 files):**
- [x] ui/avatar.tsx (UNIQUE - keep)
- [x] ui/badge.tsx (compare with landing version)
- [x] ui/button.tsx (compare with landing version)
- [x] ui/card.tsx (compare with landing version)
- [x] ui/input.tsx (UNIQUE - keep)
- [x] ui/label.tsx (UNIQUE - keep)
- [x] ui/progress.tsx (UNIQUE - keep)

#### Lib
- [x] lib/utils.ts (MERGE with landing)
- [x] lib/mockData.ts (UNIQUE - keep)

### Public Assets
- [x] file.svg (duplicate)
- [x] globe.svg (duplicate)
- [x] next.svg (duplicate)
- [x] vercel.svg (duplicate)
- [x] window.svg (duplicate)

---

## 🔄 Merge Strategy

### Config Files Priority
- **package.json**: Use dashboard version (both identical)
- **tsconfig.json**: Use `"@/*": ["./*"]` (no src/ folder)
- **next.config.ts**: Use landing version (has image config)
- **components.json**: Use dashboard version
- **globals.css**: MERGE both (landing animations + dashboard theme)

### Component Conflicts (3 files)
Need to compare and choose best version:
1. ui/badge.tsx vs ui/badge.tsx
2. ui/button.tsx vs ui/button.tsx
3. ui/card.tsx vs ui/card.tsx
4. lib/utils.ts vs lib/utils.ts

### Public Assets
- Keep all unique images from landing
- Keep one copy of duplicate SVGs (use dashboard versions)

---

## 📋 New Structure

```
micro-analytics/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx (from landing)
│   │   └── page.tsx (from landing)
│   ├── (dashboard)/
│   │   ├── layout.tsx (from dashboard)
│   │   └── dashboard/
│   │       ├── page.tsx (overview)
│   │       ├── pages/page.tsx
│   │       ├── referrers/page.tsx
│   │       ├── devices/page.tsx
│   │       ├── settings/page.tsx
│   │       └── profile/page.tsx
│   ├── layout.tsx (new root layout)
│   ├── globals.css (merged)
│   └── favicon.ico
├── components/
│   ├── marketing/ (10 files from landing)
│   ├── dashboard/ (3 files from dashboard)
│   └── ui/ (10 files merged)
├── lib/
│   ├── utils.ts (merged)
│   └── mockData.ts (from dashboard)
├── public/ (8 files total)
├── package.json (from dashboard)
├── tsconfig.json (updated paths)
├── next.config.ts (from landing)
├── components.json
├── eslint.config.mjs
├── postcss.config.mjs
└── next-env.d.ts
```

**Total files to migrate: ~50 files**
**Estimated completion: 30-45 minutes**

