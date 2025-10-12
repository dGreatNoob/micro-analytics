# 🚀 Phase 4 Quick Start Guide

**Ready to test the tracking script?** Follow these simple steps:

---

## ⚡ 5-Minute Test

### Step 1: Start Development Server

```bash
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

---

### Step 2: Open Test Page

Open in your browser:
```
http://localhost:3000/test-tracking.html
```

You should see a **purple gradient page** with:
- ✅ "Tracking script loaded successfully" message
- Site info displayed
- "Track Another Pageview" button

---

### Step 3: Check Server Logs

In your terminal (where `npm run dev` is running), you should see:

```bash
[Tracking] Received pageview: {
  siteId: 'test-site-id-123',
  pathname: '/test-tracking.html',
  referrer: '(direct)',
  visitorId: 'abc123xyz',
  timestamp: '2025-10-12T...'
}
```

**✅ If you see this → Tracking works!**

---

### Step 4: Test with DevTools

**Open DevTools (F12):**

1. **Console Tab:**
   - Look for the test page banner
   - No errors = ✅

2. **Network Tab:**
   - Look for POST to `/api/track`
   - Status: 200 = ✅
   - Click it to see request/response

3. **Click "Track Another Pageview" button:**
   - Should see new request in Network tab
   - Should see new log in terminal

---

## 🌐 Test with Real Site

### Using Dashboard

1. **Create a site:**
   ```
   http://localhost:3000/dashboard/sites
   → Click "Create New Site"
   → Enter name and domain
   ```

2. **Get tracking script:**
   - Click on your site
   - Copy either script (dev or minified)

3. **Add to your website:**
   ```html
   <head>
     <script async defer 
       src="http://localhost:3000/m.js" 
       data-site="your-site-id">
     </script>
   </head>
   ```

4. **Open your site:**
   - Check server logs
   - Should see pageview tracked!

---

## 🎯 Success Checklist

- [ ] Test page loads without errors
- [ ] Server logs show pageview data
- [ ] Network tab shows POST to /api/track
- [ ] Manual tracking button works
- [ ] Can integrate with real HTML file
- [ ] Script fails gracefully when server is off

---

## 🐛 Troubleshooting

### "No tracking data in logs"

**Check:**
- Is dev server running?
- Is Network tab showing POST request?
- Check Console tab for errors
- Try refreshing page

### "Script not loading"

**Check:**
- URL is correct: `http://localhost:3000/m.js`
- `data-site` attribute is set
- No adblocker blocking script

### "CORS error"

**Should not happen** (CORS headers configured)  
If it does: Restart dev server

---

## 📖 Full Documentation

- **Testing Guide:** See `TEST-PHASE-4.md`
- **Phase 4 Summary:** See `PHASE-4-COMPLETE.md`
- **Implementation Details:** See comments in `public/m.js`

---

## 🎉 Quick Verification Commands

```bash
# 1. Build (check for errors)
npm run build

# 2. Start dev server
npm run dev

# 3. Open test page (in browser)
# http://localhost:3000/test-tracking.html

# 4. Check if script exists
ls -lh public/m.js public/m.min.js

# 5. Check script size
du -h public/m.min.js  # Should show ~2KB
```

---

## ⏭️ What's Next

**Phase 4 is complete!** 🎉

**Next:** Phase 5 - Data Ingestion API
- Store pageviews in database
- Parse user-agent for device/browser/OS
- Add geolocation (country from IP)
- Implement rate limiting

**Timeline:** Starting Oct 21, 2025

---

**Need help?** Check `TEST-PHASE-4.md` for detailed instructions!


