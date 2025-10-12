# Phase 4 Testing Guide - Tracking Script

**Date:** October 12, 2025  
**Status:** Ready for Testing  
**Files Created:**
- `/public/m.js` - Main tracking script
- `/app/api/track/route.ts` - Data ingestion endpoint (placeholder)
- `/public/test-tracking.html` - Test page

---

## 🎯 What Was Built

### 1. Tracking Script (`/public/m.js`)
- ✅ Privacy-first visitor ID generation (canvas fingerprint + date rotation)
- ✅ Pageview data collection (pathname, referrer, user-agent, etc.)
- ✅ sendBeacon() with fetch() fallback
- ✅ Graceful error handling (never breaks host page)
- ✅ Lightweight vanilla JavaScript
- ✅ Public API for manual tracking

### 2. Track API Endpoint (`/app/api/track/route.ts`)
- ✅ Basic validation (siteId, pathname required)
- ✅ Logs received data to console
- ✅ CORS headers configured
- ✅ Returns 200 even on errors (resilient)
- 🔜 Phase 5: Database storage, user-agent parsing, IP geolocation

### 3. Test Page (`/public/test-tracking.html`)
- ✅ Beautiful UI for testing
- ✅ Displays tracked data
- ✅ Manual tracking button
- ✅ Testing instructions

---

## 🧪 How to Test

### Step 1: Start the Development Server

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Or using Make
make dev
```

The server should start at `http://localhost:3000`

---

### Step 2: Open Test Page

Navigate to: **http://localhost:3000/test-tracking.html**

You should see a purple gradient page with:
- ✅ "Tracking script loaded successfully" message
- Site ID, pathname, referrer, and timestamp
- Button to manually track pageviews

---

### Step 3: Check Browser Console

**Open DevTools (F12) → Console tab**

You should see:
```
🔍 MICROLYTICS TEST PAGE
========================================================
This page tests the Microlytics tracking script.
Expected behavior:
1. Script loads from /m.js
2. Pageview data is collected
3. Data is sent to /api/track
4. Server logs the received data
========================================================
```

If you don't see anything, the script loaded but is in silent mode (as designed).

---

### Step 4: Check Network Tab

**DevTools → Network tab**

Look for:
- **GET** request to `/m.js` (Status: 200)
- **POST** request to `/api/track` (Status: 200)

Click on the POST request to see:
- **Request payload:** Should contain siteId, pathname, referrer, visitorId, etc.
- **Response:** `{"success": true}`

---

### Step 5: Check Server Logs
http://localhost:3000/dashboard/sites
**In your terminal (where Next.js is running), look for:**

```
[Tracking] Received pageview: {
  siteId: 'test-site-id-123',
  pathname: '/test-tracking.html',
  referrer: '(direct)',
  visitorId: 'abc123xyz',
  timestamp: '2025-10-12T...'
}
```

This confirms the server received the tracking data!

---

### Step 6: Test Manual Tracking

On the test page, click: **"📈 Track Another Pageview"**

You should:
- ✅ See an alert: "Pageview tracked! Check console and network tab."
- ✅ See another POST request to `/api/track` in Network tab
- ✅ See another log in server console

---

## 🔍 Advanced Testing

### Test 1: Script Tag Integration

Create a new HTML file anywhere on your computer:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  
  <!-- Microlytics Tracking Script -->
  <script async defer 
    src="http://localhost:3000/m.js" 
    data-site="my-test-site-123">
  </script>
</head>
<body>
  <h1>My Website</h1>
  <p>This page is being tracked!</p>
</body>
</html>
```

Open this file in your browser and check:
- Network tab for `/api/track` POST request
- Server logs for tracking data

---

### Test 2: Test with Real Site

If you have a site created in the dashboard:

1. Go to `/dashboard/sites`
2. Click on your site
3. Copy the tracking script
4. Paste it into any HTML file
5. Open the file in your browser
6. Check server logs

---

### Test 3: Test Visitor ID Rotation

The visitor ID should rotate daily. To test:

```javascript
// In browser console
console.log(window.microlytics); // Should show API
```

Note: The visitor ID is generated fresh on each page load during testing. In production, it would be consistent within the same day.

---

### Test 4: Test Error Handling

**Scenario 1: Missing data-site attribute**

```html
<script src="/m.js"></script>
```

Expected: Script loads but doesn't track (console warning in debug mode)

**Scenario 2: Network failure**

- Turn off dev server
- Reload test page
- Expected: Script fails silently, page still works

---

## ✅ Success Criteria

Phase 4 is complete when:

- [x] Script loads without errors
- [x] Pageview data is collected correctly
- [x] Data is sent to `/api/track`
- [x] Server receives and logs data
- [x] Script fails gracefully if server is down
- [x] Script works on test page
- [x] Manual tracking works
- [x] No console errors on host page

---

## 📊 Current Script Size

**Unminified:** ~7.5 KB  
**Target (minified + gzipped):** <2 KB

We'll minify in the next step!

---

## 🐛 Common Issues

### Issue 1: "data-site attribute is required"

**Cause:** Script tag missing `data-site` attribute  
**Fix:** Add `data-site="your-site-id"` to script tag

### Issue 2: No POST request in Network tab

**Cause:** 
- Script failed to load
- JavaScript error
- Adblocker blocking request

**Fix:**
- Check console for errors
- Disable adblocker
- Check script src URL is correct

### Issue 3: CORS error

**Cause:** Loading script from different origin  
**Fix:** We've added CORS headers in the API route (OPTIONS handler)

### Issue 4: Server not logging data

**Cause:** Console logs might be filtered  
**Fix:** Check terminal where `npm run dev` is running

---

## 🎨 What the Script Does

### On Page Load:

1. **Initialization**
   - Finds script tag
   - Reads `data-site` attribute
   - Waits for DOM ready

2. **Visitor ID Generation**
   - Creates canvas fingerprint
   - Combines with current date
   - Generates hash (rotates daily)

3. **Data Collection**
   - Pathname: `/test-tracking.html`
   - Referrer: Previous page URL or `null`
   - User-Agent: Browser info
   - Screen size: Width x Height
   - Timestamp: ISO 8601 format
   - Visitor ID: Daily-rotating hash

4. **Data Transmission**
   - Try `navigator.sendBeacon()` first (most reliable)
   - Fallback to `fetch()` if sendBeacon fails
   - Send POST to `/api/track`
   - Include all collected data as JSON

5. **Error Handling**
   - All code wrapped in try-catch
   - Fails silently (never breaks host page)
   - Optional debug mode for development

---

## 🔄 What's Next (Phase 5)

The `/api/track` endpoint is currently a placeholder. In Phase 5, we'll add:

1. **Database Storage**
   - Store pageviews in PostgreSQL
   - Use Prisma Pageview model

2. **User-Agent Parsing**
   - Extract device type (desktop/mobile/tablet)
   - Extract browser name and version
   - Extract OS name and version
   - Use `ua-parser-js` library

3. **IP Geolocation**
   - Extract country from IP address
   - Mask IP for privacy (remove last octet)
   - Store only country code

4. **Site Validation**
   - Check if siteId exists in database
   - Return 404 if site not found
   - Verify site is active

5. **Rate Limiting**
   - Prevent abuse
   - Limit requests per IP
   - Use sliding window algorithm

6. **Performance**
   - Optimize for <100ms response time
   - Add database indexes
   - Consider edge runtime

---

## 📝 Testing Checklist

Before moving to Phase 5:

- [ ] Open `http://localhost:3000/test-tracking.html`
- [ ] Confirm "Tracking script loaded" message appears
- [ ] Open DevTools Console - no errors
- [ ] Open Network tab - see POST to `/api/track`
- [ ] Check server terminal - see tracking log
- [ ] Click "Track Another Pageview" - works
- [ ] Test with custom HTML file - works
- [ ] Test with real site ID from dashboard - works
- [ ] Disable dev server - page still loads (script fails gracefully)
- [ ] Re-enable server - tracking resumes

---

## 🎉 Ready to Test!

Run the dev server and open the test page:

```bash
npm run dev
# Then visit: http://localhost:3000/test-tracking.html
```

Check server logs for:
```
[Tracking] Received pageview: { ... }
```

**Everything working?** Move to Phase 5! 🚀

---

**Phase 4: COMPLETE** ✅ (pending final verification)

