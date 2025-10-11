# 🧪 Phase 3 Testing Guide

**Quick test to verify Site Management works**

---

## ✅ What to Test

### 1. Access Sites Page
```
1. Go to http://localhost:3000/dashboard
2. Click "Sites" in sidebar
3. ✅ Should see sites page (empty state or sites list)
```

### 2. Create Your First Site
```
1. Click "Create New Site" button
2. Fill form:
   - Name: "My Test Site"
   - Domain: "example.com"
   - Timezone: "UTC"
3. Click "Create Site"
4. ✅ Should close modal
5. ✅ Should show new site in grid
6. ✅ Should see site card with name, domain, site ID
```

### 3. Copy Site ID
```
1. Find the "Site ID" field on the card
2. Click the copy button
3. ✅ Should copy to clipboard
4. ✅ Should show "Copied to clipboard!" alert
```

### 4. View Site Details
```
1. Click "Manage" button on site card
2. ✅ Should navigate to /dashboard/sites/[id]
3. ✅ Should see:
   - Installation Script section
   - Site Settings form
   - Site Information
   - Danger Zone (delete)
```

### 5. Copy Tracking Script
```
1. Find the tracking script code block
2. Click "Copy" button
3. ✅ Should copy full script to clipboard
4. ✅ Script should include your site ID
```

### 6. Edit Site
```
1. Change site name to "Updated Name"
2. Click "Save Changes"
3. ✅ Should show "Site updated successfully!"
4. ✅ Name should update
5. Go back to sites list
6. ✅ Should see updated name
```

### 7. Delete Site
```
1. Scroll to "Danger Zone"
2. Click "Delete Site"
3. ✅ Should show confirmation warning
4. Click "Yes, Delete Site"
5. ✅ Should redirect to /dashboard/sites
6. ✅ Site should be gone from list
```

---

## 🐛 Expected Errors (Should Handle Gracefully)

### Invalid Domain
```
1. Try to create site with domain: "invalid"
2. ✅ Should show error: "Invalid domain format"
```

### Empty Fields
```
1. Try to create site with empty name
2. ✅ Form validation should prevent submission
```

### Cancel Operations
```
1. Click "Create New Site"
2. Click "Cancel"
3. ✅ Modal should close without creating
```

---

## 📊 Database Verification

### Check Sites in Prisma Studio
```bash
npx prisma studio
```

1. Open "Site" table
2. ✅ Should see sites you created
3. ✅ Each site should have:
   - Unique `id`
   - Unique `siteId` (cuid2 format)
   - Your `userId`
   - Name, domain, timezone
   - Timestamps

---

## 🚀 Quick Verification

**5-Minute Test:**
```
1. Create site ✅
2. View site details ✅
3. Copy tracking script ✅
4. Edit site ✅
5. Delete site ✅
```

**If all 5 work, Phase 3 is complete!** ✅

---

## 🎯 What's Working

After Phase 3, you have:

- ✅ Full CRUD for sites
- ✅ Beautiful UI with loading/error states
- ✅ Unique site ID generation
- ✅ Tracking script ready (script itself in Phase 4)
- ✅ Domain validation
- ✅ Timezone support
- ✅ Safe delete with confirmation

---

## 📝 Notes

- **Tracking script (m.js) doesn't exist yet** - That's Phase 4!
- The installation code is ready to copy, but won't work until `m.js` is built
- All sites are isolated per user (can only see own sites)

---

**Phase 3: Complete! Ready for Phase 4! 🎉**

