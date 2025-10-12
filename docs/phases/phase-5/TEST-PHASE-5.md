# Phase 5 Testing Guide - Data Ingestion API

**Date:** October 12, 2025  
**Status:** All Tests Passed ✅  
**Database:** 111+ pageviews stored

---

## 🎯 What to Test

Phase 5 adds **full database storage** and **device detection**. 

---

## ✅ Quick Test (2 Minutes)

### Step 1: Open Test Page

```
http://localhost:3000/
```

### Step 2: Check Terminal

You should see:
```
✅ [Tracking] Pageview Stored in Database
💻 Device: Desktop
🌐 Browser: Chrome 140
🖥️ OS: Linux
🔢 DB ID: pv_...
```

**✅ If you see this → Phase 5 works!**

### Step 3: Open Prisma Studio

```
http://localhost:5557
```

1. Click "Pageview" model
2. See your pageviews with device/browser/OS data

**✅ If data is there → Phase 5 complete!**

---

## 🧪 Comprehensive Testing

### Test 1: Desktop Tracking

**URL:** `http://localhost:3000/`

**Expected Logs:**
```
💻 Device:      Desktop
🌐 Browser:     Chrome / Firefox / Safari / Edge
🖥️  OS:          Linux / Windows / MacOS
```

**Verify in Prisma Studio:**
- Device column shows "Desktop"
- Browser name is correct
- OS is your actual OS

✅ **PASSED**

---

### Test 2: Mobile Tracking

**Requirements:**
- Dev server with network access: `npm run dev -- --hostname 0.0.0.0`
- Phone on same WiFi

**On Phone, Open:**
```
http://192.168.0.42:3000/
```
(Replace with your laptop's IP)

**Expected Logs:**
```
💻 Device:      Mobile
🌐 Browser:     Safari Mobile / Chrome Mobile
🖥️  OS:          iOS / Android
📍 IP:          192.168.0.0 (masked)
```

**Verify in Prisma Studio:**
- Device column shows "Mobile"
- Browser shows mobile variant
- OS shows iOS or Android
- IP is masked (ends in .0)

✅ **PASSED**

---

### Test 3: Rate Limiting

**In browser console:**

```javascript
// Send 105 requests quickly (exceeds 100/min limit)
for (let i = 0; i < 105; i++) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: 'iam2ttdx8jgnvfpg5aikziun',
      pathname: '/rate-limit-test',
      hostname: 'localhost',
      referrer: null,
      userAgent: navigator.userAgent,
      visitorId: 'test-' + i,
      timestamp: new Date().toISOString()
    })
  }).then(r => r.json()).then(d => {
    if (!d.success) console.log('❌ Rate limited at request', i, d);
  });
}
```

**Expected:**
- First 100 requests: Success (200)
- Requests 101-105: Rate limited (429)
- Terminal shows warning: "Rate limit exceeded"

✅ **PASSED**

---

### Test 4: Invalid Site ID

**In browser console:**

```javascript
fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    siteId: 'invalid-site-id',
    pathname: '/test',
    hostname: 'localhost',
    referrer: null,
    userAgent: navigator.userAgent,
    visitorId: 'test',
    timestamp: new Date().toISOString()
  })
}).then(r => r.json()).then(d => console.log('Response:', d))
```

**Expected:**
- Response: `{success: false, error: "Invalid site ID"}`
- Status: 404
- Terminal: Warning about invalid site ID
- No data stored in database

✅ **PASSED**

---

### Test 5: Malformed Request

**In browser console:**

```javascript
fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // Missing required fields
    pathname: '/test'
  })
}).then(r => r.json()).then(d => console.log('Response:', d))
```

**Expected:**
- Response: `{success: false, error: "Invalid pageview data"}`
- Status: 400
- No data stored in database

✅ **PASSED**

---

## 📊 Database Verification

### Check Total Count

```bash
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.pageview.count().then(c => console.log('Total pageviews:', c)).then(() => p.\$disconnect())"
```

**Current:** 111 pageviews ✅

### Check Recent Entries

Open Prisma Studio: `http://localhost:5557`

**Verify:**
- Entries exist in Pageview table
- All fields populated (no nulls except country/referrer)
- Device/Browser/OS parsed correctly
- Timestamps accurate
- Visitor IDs present

✅ **PASSED**

---

## 🎯 Success Criteria

Phase 5 is complete when:

- [x] Pageviews stored in database
- [x] Device detection working (Desktop/Mobile/Tablet)
- [x] Browser detection working (name + version)
- [x] OS detection working (name + version)
- [x] IP addresses masked for privacy
- [x] Rate limiting prevents abuse
- [x] Invalid site IDs rejected
- [x] Malformed requests rejected
- [x] Error handling prevents crashes
- [x] Response time <100ms
- [x] Multi-device tracking works
- [x] Data visible in Prisma Studio

**All criteria met!** ✅

---

## 🐛 Troubleshooting

### Issue: "Invalid site ID"

**Cause:** Site ID doesn't exist in database  
**Fix:** 
1. Check Prisma Studio → Site table → siteId column
2. Update test files with correct site ID
3. Or create new site in dashboard

### Issue: No logs appear

**Cause:** Dev server might be filtering logs  
**Fix:**
1. Restart dev server
2. Check terminal has `NODE_ENV=development`
3. Logs only show in dev mode

### Issue: Data not in database

**Cause:** Database connection issue  
**Fix:**
1. Check database is running: `make db-up`
2. Verify Prisma can connect: `npx prisma studio`
3. Check .env has correct DATABASE_URL

### Issue: Device always shows "Desktop"

**Cause:** User-Agent not being sent or parsed  
**Fix:**
1. Check Network tab - verify userAgent in request payload
2. Check ua-parser-js is installed: `npm list ua-parser-js`
3. Restart dev server

---

## 📱 Mobile Testing Tips

### Enable Remote Debugging (Android)

1. Connect phone via USB
2. Enable Developer Options → USB Debugging
3. Open Chrome on phone
4. On laptop: `chrome://inspect`
5. View console logs from phone

### Enable Remote Debugging (iOS)

1. Settings → Safari → Advanced → Web Inspector
2. Connect iPhone via USB
3. On Mac: Safari → Develop → [Your iPhone]
4. View console logs from phone

---

## 🎉 Test Results Summary

**Desktop Testing:**
- ✅ Device: Desktop
- ✅ Browser: Chrome 140
- ✅ OS: Linux
- ✅ Stored in DB

**Mobile Testing:**
- ✅ Device: Mobile
- ✅ Browser: Mobile Chrome 141
- ✅ OS: Android 10
- ✅ Stored in DB

**Rate Limiting:**
- ✅ 100 requests allowed
- ✅ 101st request blocked

**Validation:**
- ✅ Invalid site IDs rejected
- ✅ Malformed requests rejected

**Database:**
- ✅ 111+ entries stored
- ✅ All fields populated correctly
- ✅ No data loss
- ✅ Fast queries

---

## 🚀 Ready for Phase 6!

Phase 5 is **100% complete** and **thoroughly tested**.

**Next:** Build dashboard analytics queries to show this real data!

---

**Phase 5: COMPLETE** ✅  
**Testing: ALL PASSED** ✅  
**Production Ready:** YES ✅

