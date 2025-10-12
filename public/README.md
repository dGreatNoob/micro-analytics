# Public Folder - Static Assets

**Purpose:** Serve static files directly from root URL  
**Path:** `/public/`  
**Access:** Files are served from root (e.g., `/public/scripts/m.js` → `http://localhost:3000/scripts/m.js`)

---

## 📁 Folder Structure

```
public/
├── images/                  # PNG/JPG images
│   ├── app_icon.png        # App icon (28×28, used in dashboard)
│   ├── app.png             # App logo (48×48, used in auth/marketing)
│   ├── developer-working.png
│   ├── the-creator.png
│   └── visionary-leader.png
│
├── icons/                   # SVG icons
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── scripts/                 # Tracking scripts
│   ├── m.js                # Main tracking script (development)
│   └── m.min.js            # Minified tracking script (production)
│
├── test/                    # Test pages
│   ├── index.html          # Unified test page
│   └── README.md           # Test documentation
│
└── README.md               # This file
```

---

## 🎯 File Usage

### Images (`/images/`)

| File | Used In | Purpose |
|------|---------|---------|
| `app_icon.png` | Dashboard header, Marketing header | Brand logo (28×28) |
| `app.png` | Sign-in page, Marketing footer | Brand logo (48×48) |
| `developer-working.png` | Testimonials | User avatar |
| `visionary-leader.png` | Testimonials | User avatar |
| `the-creator.png` | Testimonials | User avatar |

**Updated in:**
- `components/dashboard/dashboard-layout.tsx`
- `app/auth/signin/page.tsx`
- `components/marketing/footer.tsx`
- `components/marketing/header.tsx`
- `components/marketing/testimonials.tsx`

---

### Icons (`/icons/`)

| File | Purpose |
|------|---------|
| `file.svg` | Generic file icon |
| `globe.svg` | Globe/web icon |
| `next.svg` | Next.js logo |
| `vercel.svg` | Vercel logo |
| `window.svg` | Window icon |

**Note:** These are default Next.js icons and not currently used in active code.

---

### Scripts (`/scripts/`)

| File | Size | Purpose |
|------|------|---------|
| `m.js` | 6.3 KB | Development tracking script (unminified, readable) |
| `m.min.js` | 2.5 KB | Production tracking script (minified, ~1.8 KB gzipped) |

**Used In:**
- `app/(dashboard)/dashboard/sites/[siteId]/page.tsx` - Site details (tracking script display)
- `app/(dashboard)/dashboard/sites/page.tsx` - Sites list (copy script function)
- `app/(dashboard)/dashboard/settings/page.tsx` - Settings page (example)
- `components/marketing/how-it-works.tsx` - Marketing page (demo)
- `public/test/index.html` - Test page

**Public URLs:**
- Development: `http://localhost:3000/scripts/m.js`
- Production: `https://microlytics.app/scripts/m.js`

---

### Test Files (`/test/`)

| File | Purpose |
|------|---------|
| `index.html` | Unified test page for desktop + mobile testing |
| `README.md` | Test documentation and instructions |

**Access:**
- Local: `http://localhost:3000/test/index.html` or `http://localhost:3000/test/`
- Network: `http://192.168.0.42:3000/test/` (from other devices)

---

## 🔒 Important Notes

### File Paths in Code

All references use **absolute paths from public root**:

```typescript
// ✅ Correct
<Image src="/images/app.png" />
<script src="/scripts/m.js"></script>

// ❌ Wrong
<Image src="images/app.png" />  // Missing leading slash
<Image src="/public/images/app.png" />  // Don't include 'public' in path
```

### Adding New Files

When adding new static files:

1. **Images** (PNG, JPG) → `/public/images/`
2. **Icons** (SVG) → `/public/icons/`
3. **Scripts** (JS) → `/public/scripts/`
4. **Test files** (HTML) → `/public/test/`
5. **Other** (fonts, etc.) → Create appropriate folder

### Accessing Files

All files in `/public/` are served from root URL:

```
/public/images/app.png  →  http://localhost:3000/images/app.png
/public/scripts/m.js    →  http://localhost:3000/scripts/m.js
/public/test/index.html →  http://localhost:3000/test/index.html
```

---

## 🧹 Maintenance

### Before Adding Files

1. Check if similar files exist
2. Use appropriate folder
3. Update references in code
4. Test that nothing breaks

### Cleanup Checklist

- ✅ No loose files in `/public/` root
- ✅ All images in `/images/`
- ✅ All icons in `/icons/`
- ✅ All scripts in `/scripts/`
- ✅ All test files in `/test/`
- ✅ README.md in each folder (if needed)

---

## 📊 Current Files

**Total Files:** 14

- **Images:** 5 files (PNG)
- **Icons:** 5 files (SVG)
- **Scripts:** 2 files (JS)
- **Test:** 2 files (HTML + README)

**All organized and documented!** ✅

---

**Last Updated:** October 12, 2025  
**Organization:** Complete  
**Status:** Clean and maintainable

