# 🧪 Solo Developer Testing Guide

**Testing the Microlytics tracking script on a single laptop**

---

## Setup: What You Need

✅ One terminal window  
✅ One browser window  
✅ 10 minutes of time

That's it! Let's go.

---

## Test 1: Basic Tracking (2 minutes)

### Step 1: Start Dev Server

```bash
cd /home/biiieem/repos/micro-analytics
npm run dev
```

**Wait for:**
```
✓ Ready on http://localhost:3000
```

Keep this terminal open and visible. You'll watch for logs here.

---

### Step 2: Open Test Page

Open your browser to:
```
http://localhost:3000/test-tracking.html
```

**What you should see:**
- Purple gradient page
- "✅ Tracking script loaded successfully" message
- Site info displayed

---

### Step 3: Check Terminal for Tracking Log

Look at your terminal (where npm run dev is running).

**You should see:**
```
[Tracking] Received pageview: {
  siteId: 'test-site-id-123',
  pathname: '/test-tracking.html',
  referrer: '(direct)',
  visitorId: 'abc123...',
  timestamp: '2025-10-12T...'
}
```

**✅ If you see this → Phase 1 PASSED!**

---

### Step 4: Test Manual Tracking

On the test page, click the button:
```
📈 Track Another Pageview
```

**Expected:**
- Alert appears: "Pageview tracked!"
- **New log appears in terminal** with same format

**✅ If second log appears → Phase 2 PASSED!**

---

## Test 2: Network Verification (2 minutes)

### Step 1: Open DevTools

Press `F12` or right-click → Inspect

Go to **Network** tab.

---

### Step 2: Refresh Test Page

Press `Ctrl+R` (or `Cmd+R` on Mac)

**In Network tab, look for:**

1. **GET request to `/m.js`**
   - Status: 200
   - Size: ~6.3 KB
   - ✅ Means script loaded

2. **POST request to `/api/track`**
   - Status: 200
   - Size: ~400 bytes
   - ✅ Means data sent

---

### Step 3: Inspect POST Request

Click on the `/api/track` request.

**Look at "Payload" tab:**
```json
{
  "siteId": "test-site-id-123",
  "pathname": "/test-tracking.html",
  "hostname": "localhost",
  "referrer": null,
  "userAgent": "Mozilla/5.0...",
  "language": "en-US",
  "screenWidth": 1920,
  "screenHeight": 1080,
  "timestamp": "2025-10-12T...",
  "visitorId": "abc123..."
}
```

**✅ If you see all these fields → Phase 3 PASSED!**

---

## Test 3: Real Site Integration (5 minutes)

### Step 1: Create a Test Site

1. Go to: `http://localhost:3000/dashboard/sites`
2. Click "Add Site"
3. Fill in:
   - Name: "My Test Site"
   - Domain: "localhost"
   - Timezone: "UTC"
4. Click "Create Site"

**You should see your new site in the grid.**

---

### Step 2: Get Tracking Script

1. Click on your new site card
2. Scroll to "Installation Script"
3. Copy the **Development** version
4. Keep the site ID handy (looks like: `clh4j8k2l0000qz8r9x7v3w2g`)

---

### Step 3: Create Test HTML File

Create a file anywhere on your computer: `~/test-microlytics.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Testing Microlytics</title>
  
  <!-- PASTE YOUR TRACKING SCRIPT HERE -->
  <script async defer 
    src="http://localhost:3000/m.js" 
    data-site="YOUR-SITE-ID-HERE">
  </script>
</head>
<body>
  <h1>My Test Website</h1>
  <p>If tracking works, this pageview will appear in the logs!</p>
  
  <button onclick="window.microlytics.trackPageview()">
    Track Another Pageview
  </button>
</body>
</html>
```

**Replace `YOUR-SITE-ID-HERE` with your actual site ID!**

---

### Step 4: Open HTML File in Browser

1. Open `~/test-microlytics.html` in your browser
   - File → Open File
   - Or drag file into browser

2. **Look at terminal immediately**

**You should see:**
```
[Tracking] Received pageview: {
  siteId: 'YOUR-ACTUAL-SITE-ID',
  pathname: '/',
  referrer: '(direct)',
  visitorId: 'xyz789...',
  timestamp: '2025-10-12T...'
}
```

**✅ If you see log with YOUR site ID → Phase 4 PASSED!**

---

### Step 5: Test Button

Click the "Track Another Pageview" button.

**Expected:**
- New log appears in terminal
- Same site ID
- Updated timestamp

**✅ If button works → Phase 5 PASSED!**

---

## Test 4: Error Handling (2 minutes)

### Test Silent Failure

1. **Stop dev server** (Ctrl+C in terminal)
2. Refresh your test HTML file
3. Page should **load normally**
4. No JavaScript errors in console

**✅ If page loads without errors → Phase 6 PASSED!**

---

### Test Recovery

1. **Restart dev server:** `npm run dev`
2. Refresh test HTML again
3. **New log should appear** in terminal

**✅ If tracking resumes → Phase 7 PASSED!**

---

## Test 5: Visitor ID Rotation (1 minute)

### Current Behavior

The visitor ID is currently generated fresh on each page load for testing.

**To see visitor IDs:**

1. Open test page: `http://localhost:3000/test-tracking.html`
2. Check terminal for `visitorId: 'abc123...'`
3. Refresh page
4. Check terminal again - **new visitor ID**

This is expected! In production:
- Same device = same ID for 24 hours
- Next day = new ID (privacy rotation)

**✅ If visitor IDs appear → Phase 8 PASSED!**

---

## Quick Verification Checklist

Run through this quickly:

```bash
# Terminal 1: Start server
npm run dev

# Browser 1: Open test page
# http://localhost:3000/test-tracking.html

# Terminal 1: Should show log ✅

# Browser 1: Click "Track Another Pageview"
# Terminal 1: Should show second log ✅

# Browser 2: Open custom HTML with your site ID
# Terminal 1: Should show log with your site ID ✅

# Terminal 1: Press Ctrl+C (stop server)
# Browser 2: Refresh page (should load fine) ✅

# Terminal 1: npm run dev (restart)
# Browser 2: Refresh page (tracking resumes) ✅
```

**If all ✅ → Tracking script is working perfectly!**

---

## Understanding What You're Seeing

### In Terminal (Server Logs):

```
[Tracking] Received pageview: {
  siteId: 'abc123',      ← Which site tracked this
  pathname: '/about',    ← What page was viewed
  referrer: 'google.com', ← Where user came from
  visitorId: 'xyz789',   ← Anonymous visitor ID
  timestamp: '2025...'   ← When it happened
}
```

This is Phase 4 behavior (logging only).  
Phase 5 will **store this in the database** instead!

---

### In Browser Network Tab:

```
POST /api/track
Status: 200 OK
Response: {"success": true}
```

This means:
- ✅ Script successfully sent data
- ✅ Server received it
- ✅ No errors

---

## What If Something's Wrong?

### No logs in terminal?

**Check:**
```bash
# 1. Is server running?
ps aux | grep "next dev"

# 2. Is it on port 3000?
lsof -i :3000

# 3. Restart server
npm run dev
```

---

### "Script not loading" error?

**Fix:**
```html
<!-- Wrong (won't work with file://) -->
<script src="/m.js" data-site="..."></script>

<!-- Right (full URL) -->
<script src="http://localhost:3000/m.js" data-site="..."></script>
```

---

### No POST request in Network tab?

**Check:**
1. DevTools Network tab is open BEFORE page load
2. Clear and refresh (Ctrl+Shift+R)
3. Check Console tab for JavaScript errors
4. Verify `data-site` attribute is set

---

## Advanced: Testing Different Scenarios

### Test Different Pages

Create multiple HTML files:
- `~/test-home.html` (pathname: '/')
- `~/test-about.html` (pathname: '/about')
- `~/test-contact.html` (pathname: '/contact')

Each should log with different `pathname` values.

---

### Test Referrer Tracking

1. Open `test-home.html`
2. Add link: `<a href="test-about.html">About</a>`
3. Click link
4. Check logs - `referrer` should show previous page

---

### Test Multiple Sites

1. Create 2 sites in dashboard
2. Create 2 HTML files with different site IDs
3. Open both
4. Terminal should show logs with different `siteId` values

---

## Success Criteria

**✅ You're done when:**

- [ ] Test page shows tracking data
- [ ] Terminal logs appear for each pageview
- [ ] Network tab shows POST to /api/track
- [ ] Custom HTML file tracks with real site ID
- [ ] Manual tracking button works
- [ ] Page loads fine when server is off
- [ ] Tracking resumes when server restarts
- [ ] No console errors in browser

**All checked?** → **Phase 4 is working perfectly!** 🎉

---

## What's Actually Happening?

```
Browser loads page
    ↓
m.js script executes
    ↓
Collects data (pathname, referrer, etc.)
    ↓
Generates visitor ID (canvas fingerprint + date)
    ↓
Sends to /api/track via sendBeacon()
    ↓
Server receives POST request
    ↓
Logs to console (Phase 4)
    ↓
Returns {"success": true}
```

**Phase 5 will add:** Store in PostgreSQL instead of logging!

---

## Pro Tips

### Tip 1: Keep Terminal Visible

Split your screen:
- Left: Terminal with logs
- Right: Browser

You'll see logs appear in real-time! Very satisfying.

---

### Tip 2: Use Multiple Browser Tabs

Open several tabs with different pages.  
Watch logs appear for each!

---

### Tip 3: Test on Mobile (Optional)

1. Find your laptop's local IP:
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```
   
2. Update script src in HTML:
   ```html
   <script src="http://YOUR-IP:3000/m.js" ...>
   ```

3. Open on phone (must be on same WiFi)

---

## Ready for Phase 5?

Once all tests pass, Phase 4 is complete!

**Phase 5 will add:**
- Store pageviews in PostgreSQL ✅
- Parse user-agent for device/browser/OS ✅
- Add country detection from IP ✅
- Validate site IDs against database ✅

But for now, **you have a working tracking script!** 🚀

---

## Quick Reference

```bash
# Start testing
npm run dev
# Open: http://localhost:3000/test-tracking.html
# Watch terminal for logs

# Check files exist
ls -lh public/m.js public/m.min.js

# Check API route exists
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{"siteId":"test","pathname":"/"}'
```

---

**Happy Testing!** 🧪

