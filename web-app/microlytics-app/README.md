# Microlytics Dashboard

A modern, privacy-first web analytics dashboard built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Beautiful Dashboard**: Modern UI with glassmorphism effects and smooth animations
- **Dark Mode**: Seamless dark/light theme switching with next-themes
- **Fully Responsive**: Mobile-first design with collapsible sidebar
- **Analytics Pages**:
  - Overview - Main dashboard with stats, charts, and tables
  - Pages - Detailed page performance metrics
  - Referrers - Traffic sources and referral analytics
  - Devices - Device, browser, and OS breakdown
  - Settings - Site configuration and tracking script
  - Profile - User account management
- **Interactive Charts**: Built with Recharts for beautiful data visualization
- **Ready for Backend**: Mock data structure ready to connect to a real API

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes
- **Fonts**: Geist Sans & Geist Mono

## 📦 Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
microlytics-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with ThemeProvider
│   ├── page.tsx           # Overview page (main dashboard)
│   ├── pages/             # Pages analytics
│   ├── referrers/         # Referrers analytics
│   ├── devices/           # Device analytics
│   ├── settings/          # Site settings
│   └── profile/           # User profile
├── components/
│   ├── dashboard-layout.tsx    # Main layout with sidebar
│   ├── stat-card.tsx          # Metric card component
│   ├── time-range-selector.tsx # Time range filter
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── utils.ts           # Utility functions
│   └── mockData.ts        # Mock analytics data
└── public/                # Static assets
```

## 🎨 Design System

The dashboard uses a custom color palette with blue/indigo accents:

- **Primary**: `oklch(0.60 0.22 264)` - Indigo blue
- **Charts**: Multiple color variants for data visualization
- **Theme**: Light/dark mode with smooth transitions

## 🔌 Backend Integration

The dashboard is ready to connect to a backend API. Replace the mock data in `lib/mockData.ts` with actual API calls:

```typescript
// Example API integration
const { data } = await fetch('/api/analytics/overview')
```

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet/Mobile**: Collapsible sidebar with hamburger menu
- **Touch-friendly**: Optimized for mobile interactions

## 🌙 Dark Mode

Toggle between light and dark themes using the button in the header. Theme preference is persisted using next-themes.

## 🚢 Deployment

Deploy to Vercel, Netlify, or any platform that supports Next.js:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📝 License

MIT License - feel free to use this project for your own analytics dashboard!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and shadcn/ui
