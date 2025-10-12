# Microlytics Test Page

**Location:** `/public/test/index.html`  
**URL:** `http://localhost:3000/test/` or `http://192.168.0.42:3000/test/`

---

## 🎯 Single Test Page for Everything

We now have **ONE** comprehensive test page that handles:
- ✅ Desktop testing
- ✅ Mobile testing (when accessed from phone)
- ✅ Tablet testing
- ✅ Network testing (other devices on WiFi)
- ✅ Device/browser/OS detection
- ✅ Database storage verification

**No more multiple test files!** Just one simple page.

---

## 🚀 Quick Start

### Local Testing (Your Laptop)

**Open:**
```
http://localhost:3000/test/
```

**You should see:**
- Purple gradient page
- "✅ Tracking script loaded!" message
- Device info (Desktop, screen size, etc.)
- Three buttons (Track, Dashboard, Database)

**Check terminal immediately** for logs like:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ [Tracking] Pageview Stored in Database
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 Site:        Test Site
📄 Page:        /
💻 Device:      Desktop
🌐 Browser:     Chrome 131
🖥️  OS:          Linux
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Mobile Testing (Phone/Tablet)

**Start dev server with network access:**
```bash
npm run dev -- --hostname 0.0.0.0
```

**On your phone, open:**
```
http://192.168.0.42:3000/test/
```
(Replace 192.168.0.42 with your laptop's IP)

**Expected logs:**
```
💻 Device:      Mobile (or Tablet)
🌐 Browser:     Safari Mobile / Chrome Mobile
🖥️  OS:          iOS / Android
```

---

## 🧪 Testing Features

### Button 1: Track Another Pageview
- Click to manually trigger tracking
- Useful for testing without page refresh
- Each click = new pageview in database

### Button 2: Open Dashboard
- Opens `/dashboard/sites` in new tab
- View your sites and tracking scripts
- Quick access for site management

### Button 3: View Database
- Opens Prisma Studio (http://localhost:5557)
- View all stored pageviews
- Verify device/browser/OS detection
- Check visitor IDs and timestamps

---

## ✅ Verification Checklist

### Desktop Testing
- [ ] Open `http://localhost:3000/test/`
- [ ] Page loads successfully
- [ ] Terminal shows tracking log
- [ ] Log says "Stored in Database"
- [ ] Device detected as "Desktop"
- [ ] Browser detected correctly
- [ ] OS detected correctly
- [ ] Click "Track Another Pageview" → new log appears
- [ ] Click "View Database" → see pageviews in Prisma Studio

### Mobile Testing
- [ ] Start dev server: `npm run dev -- --hostname 0.0.0.0`
- [ ] Open on phone: `http://192.168.0.42:3000/test/`
- [ ] Terminal shows tracking log
- [ ] Device detected as "Mobile" or "Tablet"
- [ ] Browser shows mobile variant (Safari Mobile, etc.)
- [ ] OS shows iOS or Android
- [ ] Pageviews visible in Prisma Studio

### Database Verification
- [ ] Open Prisma Studio: `http://localhost:5557`
- [ ] Click "Pageview" model
- [ ] See entries with:
  - Correct pathname
  - Correct device type
  - Correct browser name
  - Correct OS name
  - Valid visitor ID
  - Proper timestamps

---

## 🔍 Debugging

### No logs in terminal?

**Check:**
1. Is dev server running? Look for "✓ Ready on http://localhost:3000"
2. Refresh the page (Ctrl+Shift+R for hard refresh)
3. Open browser console (F12) for errors
4. Check Network tab for POST to `/api/track`

### "Invalid site ID" error?

**Fix:**
1. Go to dashboard: `http://localhost:3000/dashboard/sites`
2. Click on your site
3. Look at "Site Information" section for correct Site ID
4. Update `index.html` line 10 with correct site ID

### Logs appear but not in database?

**Check:**
1. Look for "Stored in Database" in logs (not just "Received")
2. Refresh Prisma Studio page
3. Click Pageview model again
4. Check logs for any error messages

### Mobile test not working?

**Fix:**
1. Verify dev server has `--hostname 0.0.0.0`
2. Both devices on same WiFi
3. Check laptop IP: `ip -4 addr show | grep inet`
4. Update URL on phone with correct IP
5. Check firewall: `sudo ufw allow 3000`

---

## 📊 Current Configuration

**Site ID:** `iam2ttdx8jgnvfpg5aikziun`  
**Site Name:** Test Site  
**Domain:** localhost

**Tracking Script:**
```html
<script async defer 
  src="/scripts/m.js" 
  data-site="iam2ttdx8jgnvfpg5aikziun">
</script>
```

---

## 🎯 What This Tests

### Phase 4 Features:
- ✅ Script loads and executes
- ✅ Data collected from page
- ✅ Sent via sendBeacon/fetch
- ✅ Visitor ID generated

### Phase 5 Features:
- ✅ Data stored in PostgreSQL
- ✅ User-Agent parsed (device/browser/OS)
- ✅ IP address masked for privacy
- ✅ Site ID validated against database
- ✅ Rate limiting (100 req/min)

---

## 📱 Network URLs

**From your laptop:**
- Test page: `http://localhost:3000/test/`
- Dashboard: `http://localhost:3000/dashboard/sites`
- Prisma Studio: `http://localhost:5557`

**From other devices (same WiFi):**
- Test page: `http://192.168.0.42:3000/test/`
- Dashboard: `http://192.168.0.42:3000/dashboard/sites`

---

## 🎉 Success Criteria

Phase 5 is working when:
- ✅ Logs show "Stored in Database"
- ✅ Device/Browser/OS parsed correctly
- ✅ Data appears in Prisma Studio
- ✅ Mobile devices detected as "Mobile"
- ✅ Desktop devices detected as "Desktop"
- ✅ IP addresses masked (last octet = 0)

---

**Last Updated:** October 12, 2025  
**Phase:** 5 - Data Ingestion API  
**Status:** Testing
