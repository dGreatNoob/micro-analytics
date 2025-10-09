# 🚀 Micro-Analytics - Privacy-First Web Analytics

> **Beautiful, simple, privacy-first analytics for your websites — no cookies, no tracking bloat.**

A modern SaaS application built with Next.js 15, featuring a stunning landing page and comprehensive analytics dashboard.

## ✨ Features

### 🌐 Landing Page
- **Modern Design**: Glassmorphism effects with animated gradients
- **Privacy-First**: GDPR compliant, no cookies, open API
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Interactive**: Live chart previews and smooth animations

### 📊 Analytics Dashboard
- **Real-time Data**: Beautiful charts and metrics
- **Comprehensive Views**: Pages, referrers, devices, settings
- **Dark/Light Mode**: Seamless theme switching
- **Mobile Responsive**: Collapsible sidebar with hamburger menu

### 🔐 Authentication
- **Protected Routes**: Middleware-based route protection
- **Demo Auth**: Cookie-based authentication (ready for real auth)
- **Seamless Flow**: Login/signup with callback URL support

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.4 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.1.9 | Styling |
| **shadcn/ui** | Latest | Component library |
| **Recharts** | 2.15.4 | Data visualization |
| **Lucide React** | 0.454.0 | Icons |
| **next-themes** | 0.4.6 | Theme management |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd micro-analytics

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Application Structure

### Routes

#### Public Routes
- **`/`** - Landing page with hero, features, pricing
- **`/login`** - User login page
- **`/signup`** - User registration page

#### Protected Routes (Requires Authentication)
- **`/dashboard`** - Analytics overview with charts and stats
- **`/dashboard/pages`** - Page performance metrics
- **`/dashboard/referrers`** - Traffic source analytics
- **`/dashboard/devices`** - Device, browser, and OS breakdown
- **`/dashboard/settings`** - Site configuration and tracking script
- **`/dashboard/profile`** - User account management

### Directory Structure

```
micro-analytics/
├── app/                           # Next.js App Router
│   ├── (marketing)/              # Public marketing pages
│   │   ├── layout.tsx           # Marketing layout (no sidebar)
│   │   └── page.tsx             # Landing page
│   ├── (auth)/                  # Authentication pages
│   │   ├── layout.tsx           # Auth layout (centered forms)
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Signup page
│   ├── (dashboard)/             # Protected dashboard pages
│   │   ├── layout.tsx           # Dashboard layout (with sidebar)
│   │   └── dashboard/           # Dashboard routes
│   │       ├── page.tsx         # Overview
│   │       ├── pages/page.tsx   # Pages analytics
│   │       ├── referrers/page.tsx # Referrer analytics
│   │       ├── devices/page.tsx # Device analytics
│   │       ├── settings/page.tsx # Settings
│   │       └── profile/page.tsx # Profile
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── marketing/               # Landing page components
│   ├── dashboard/               # Dashboard-specific components
│   └── ui/                      # Shared UI components (shadcn)
├── lib/
│   ├── utils.ts                 # Utility functions
│   ├── mockData.ts              # Mock analytics data
│   └── auth.ts                  # Authentication helpers
├── middleware.ts                # Route protection
└── public/                      # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo blue (`oklch(0.55 0.22 264)`)
- **Charts**: 5 color variants for data visualization
- **Theme**: Light/dark mode with OKLCH color space

### Components
- **shadcn/ui**: Modern, accessible component library
- **Glassmorphism**: Subtle glass effects on cards
- **Animations**: Smooth transitions and hover effects
- **Typography**: Geist Sans & Geist Mono fonts

## 🔐 Authentication

Currently using **demo authentication** with cookies. Ready to integrate with:

- **NextAuth.js** (recommended)
- **Supabase Auth**
- **Clerk**
- **Custom JWT implementation**

### Demo Auth Flow
1. Visit `/signup` or click "Start Free Trial"
2. Fill out the form
3. Cookie is set: `auth-token=demo-token`
4. Redirected to `/dashboard`
5. Middleware protects all `/dashboard/*` routes

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build the application
npm run build

# The output will be in the .next folder
# Deploy this to your hosting platform
```

### Environment Variables

Create a `.env.local` file:

```bash
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add more as needed for your auth provider
```

## 📊 Performance

### Bundle Sizes
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    12.4 kB         230 kB
├ ○ /login                               2.85 kB         117 kB
├ ○ /signup                              3.28 kB         118 kB
├ ○ /dashboard                           3.55 kB         225 kB
├ ○ /dashboard/pages                     3.26 kB         113 kB
├ ○ /dashboard/referrers                 3.22 kB         113 kB
├ ○ /dashboard/devices                   3.14 kB         220 kB
├ ○ /dashboard/settings                  3.36 kB         114 kB
└ ○ /dashboard/profile                   1.63 kB         112 kB
```

- **Total pages**: 10
- **All static**: Pre-rendered at build time
- **Middleware**: 34 kB for route protection

## 🧪 Testing

### Manual Testing Checklist

- [ ] Landing page loads with animations
- [ ] Navigation links work correctly
- [ ] Signup flow redirects to dashboard
- [ ] Login flow works with callback URLs
- [ ] Dashboard shows single sidebar (no duplicates)
- [ ] All dashboard pages load correctly
- [ ] Dark/light theme toggle works
- [ ] Mobile responsiveness works
- [ ] Protected routes redirect when not authenticated

### Automated Testing (Future)

```bash
# Add when ready
npm install --save-dev @testing-library/react jest
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

### Phase 1 ✅ (Complete)
- [x] Unified app structure with route groups
- [x] Landing page with animations
- [x] Dashboard with charts and metrics
- [x] Dark/light theme support

### Phase 2 ✅ (Complete)
- [x] Authentication pages (login/signup)
- [x] Route protection middleware
- [x] Navigation flow between pages

### Phase 3 ✅ (Complete)
- [x] Testing and cleanup
- [x] Documentation updates
- [x] Performance optimization

### Phase 4 (Future)
- [ ] Real authentication integration
- [ ] Backend API development
- [ ] Database integration
- [ ] Real-time analytics tracking
- [ ] Payment integration
- [ ] Team collaboration features

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**

*Last updated: October 9, 2025*