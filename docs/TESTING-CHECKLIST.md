# 🧪 Testing Checklist - Phase 2

**Server Status:** ✅ Running at http://localhost:3000

---

## 📋 Pre-Testing Setup

### Required Credentials

**OAuth Credentials:**
- [ ] Google Client ID & Secret
- [ ] GitHub Client ID & Secret

**Email Service:**
- [ ] Resend API Key

**If you don't have these yet:**
- Landing page will work ✅
- Sign-in page will load ✅
- OAuth buttons won't work ❌ (need credentials)
- Welcome emails won't send ❌ (need Resend key)

---

## 🧪 Test Plan

### Part 1: Landing Page (Works without credentials)

**URL:** http://localhost:3000

- [ ] Landing page loads
- [ ] Smooth scroll animations work
- [ ] Section transitions are smooth (no bounce)
- [ ] Header is sticky
- [ ] "Sign in" button works (goes to /auth/signin)
- [ ] All sections render (Hero, Features, How It Works, Demo, Pricing, Testimonials, CTA, Footer)
- [ ] Scroll to top button appears when scrolling down
- [ ] Responsive on mobile (resize browser)

**Expected:** Everything should work perfectly ✅

---

### Part 2: Authentication Flow (Requires OAuth)

#### Test Sign-In Page

**URL:** http://localhost:3000/auth/signin

- [ ] Sign-in page loads with gradient background
- [ ] Google button is visible
- [ ] GitHub button is visible
- [ ] "Back to home" link works

**Without OAuth credentials:**
- Clicking buttons will show error ❌

**With OAuth credentials:**
- Clicking buttons redirects to OAuth provider ✅

#### Test OAuth Flow (Needs credentials)

**Google OAuth:**
- [ ] Click "Continue with Google"
- [ ] Redirects to Google login
- [ ] After authorization, redirects back
- [ ] Lands on `/dashboard`
- [ ] User is logged in

**GitHub OAuth:**
- [ ] Click "Continue with GitHub"
- [ ] Redirects to GitHub login
- [ ] After authorization, redirects back
- [ ] Lands on `/dashboard`
- [ ] User is logged in

---

### Part 3: Dashboard (Requires auth)

**URL:** http://localhost:3000/dashboard

**Without login:**
- [ ] Redirects to `/auth/signin` ✅

**After login:**
- [ ] Dashboard loads
- [ ] Shows user email in header
- [ ] "Sign out" button visible
- [ ] Shows "No sites yet" message (since you haven't added any)
- [ ] "Add Your First Site" button visible

---

### Part 4: Welcome Email (Requires Resend key)

**Test with NEW email only:**
- [ ] Sign up with email you've never used before
- [ ] Check inbox (wait 30 seconds)
- [ ] Check spam folder if not in inbox
- [ ] Email has gradient header
- [ ] Email is personalized with your name
- [ ] "Go to Dashboard" button works
- [ ] Email looks good on mobile

**Verify in Resend dashboard:**
- [ ] Go to https://resend.com/emails
- [ ] See your email in the list
- [ ] Status shows "Delivered"
- [ ] Preview looks correct

**Server logs should show:**
```
✅ Email sent: { to: 'user@example.com', subject: 'Welcome to Microlytics! 🎉', id: '...' }
```

**Or if no API key:**
```
⚠️  RESEND_API_KEY not set. Email not sent
```

---

### Part 5: Protected Routes

**Test route protection:**

1. **Logged Out:**
   - [ ] Go to http://localhost:3000/dashboard
   - [ ] Should redirect to `/auth/signin` ✅

2. **Logged In:**
   - [ ] Go to http://localhost:3000/auth/signin
   - [ ] Should redirect to `/dashboard` ✅

---

### Part 6: Sign Out

**After logging in:**
- [ ] Click "Sign out" button in dashboard header
- [ ] User is logged out
- [ ] Redirected to landing page
- [ ] Try accessing `/dashboard` - should redirect to signin

---

### Part 7: Database Verification

**Open Prisma Studio:**
```bash
npx prisma studio
# → http://localhost:5555
```

**After signing up, check tables:**

**User table:**
- [ ] New user record created
- [ ] Email matches OAuth email
- [ ] Name from OAuth profile
- [ ] `emailVerified` is set
- [ ] `createdAt` timestamp

**Account table:**
- [ ] New account record
- [ ] Provider is "google" or "github"
- [ ] Has access_token
- [ ] Linked to User via userId

**Session table:**
- [ ] New session created
- [ ] Has sessionToken
- [ ] Linked to User
- [ ] Expires in future

---

## 🐛 Common Issues & Solutions

### "Sign in failed. Try again."

**Cause:** OAuth credentials not configured

**Solution:**
1. Check `.env` has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Verify credentials are correct
3. Check OAuth app redirect URI matches: `http://localhost:3000/api/auth/callback/google`
4. Restart server: `Ctrl+C` then `make dev`

---

### Email Not Received

**Cause:** Resend API key missing or invalid

**Solution:**
1. Check `.env` has `RESEND_API_KEY`
2. Verify key is valid at https://resend.com/api-keys
3. Check spam folder
4. View server logs for errors
5. Check Resend dashboard for delivery status

**Note:** Emails only sent to NEW users (first signup)

---

### "Access Denied"

**Cause:** OAuth app not approved or restricted

**Solution:**
1. In Google Console, check OAuth consent screen is published
2. Add your email to test users if in testing mode
3. In GitHub, ensure OAuth app is active

---

### Middleware Error

**Cause:** NextAuth session not available

**Solution:**
1. Check auth callback is working
2. Clear cookies and try again
3. Check database has Session table
4. Restart server

---

### Page Not Found

**Cause:** File structure mismatch

**Solution:**
1. Verify files exist:
   - `app/auth/signin/page.tsx`
   - `app/dashboard/page.tsx`
   - `app/api/auth/[...nextauth]/route.ts`
2. Restart server

---

## 📊 Server Logs to Watch For

### ✅ Good Logs

```bash
# Server started
✓ Ready in 2.5s
Local: http://localhost:3000

# Successful OAuth callback
GET /api/auth/callback/google?code=... 200

# Welcome email sent
✅ Email sent: { to: 'user@example.com', subject: '...', id: '...' }

# Database query
prisma:query SELECT "User"."id", "User"."email" FROM "User" WHERE ...
```

### ❌ Error Logs

```bash
# Missing OAuth credentials
Error: GOOGLE_CLIENT_ID is not set

# Email service not configured
⚠️  RESEND_API_KEY not set. Email not sent

# Database connection error
Error: Can't reach database server at localhost:5432

# Auth error
[auth][error] AccessDenied: ...
```

---

## 🎯 Testing Matrix

| Feature | No Credentials | OAuth Only | OAuth + Email |
|---------|---------------|------------|---------------|
| Landing page | ✅ | ✅ | ✅ |
| Sign-in page loads | ✅ | ✅ | ✅ |
| OAuth sign-in | ❌ | ✅ | ✅ |
| Dashboard access | ❌ | ✅ | ✅ |
| Welcome email | ❌ | ❌ | ✅ |

---

## ✅ Success Criteria

### Minimum (No credentials needed)
- ✅ Landing page loads
- ✅ Smooth scrolling works
- ✅ Sign-in page accessible
- ✅ No console errors

### With OAuth (Recommended)
- ✅ Can sign in with Google
- ✅ Can sign in with GitHub
- ✅ Dashboard shows user info
- ✅ Can sign out
- ✅ Protected routes work

### Full Setup (All credentials)
- ✅ All of the above
- ✅ Welcome email received
- ✅ Email looks professional
- ✅ Database records created

---

## 🔍 How to Debug

### Check Server Logs
```bash
# Watch terminal where `make dev` is running
# Look for errors, warnings, or success messages
```

### Check Browser Console
```bash
# Open DevTools (F12)
# Check Console tab for errors
# Check Network tab for failed requests
```

### Check Database
```bash
# Open Prisma Studio
npx prisma studio

# Verify:
# - User table has records
# - Session table has active sessions
# - Account table links OAuth
```

### Check Resend Dashboard
```bash
# Go to https://resend.com/emails
# See all sent emails
# Check delivery status
# View email content
```

---

## 🎉 What to Expect

### Perfect Scenario (All credentials set)

1. Visit http://localhost:3000
2. Beautiful landing page loads ✨
3. Click "Sign in"
4. Choose Google or GitHub
5. Authorize app
6. Welcome email sent 📧
7. Redirected to dashboard
8. See your email in header
9. Dashboard shows "No sites yet"
10. Click "Sign out" - works!

### Partial Scenario (No credentials)

1. Landing page works ✅
2. Sign-in page loads ✅
3. OAuth buttons don't work ❌
4. Can't access dashboard ❌

**This is fine for initial testing!** Get credentials when ready.

---

## 📝 Notes

- **First signup only:** Welcome email only sent on FIRST signup
- **Spam folder:** Check there during testing
- **New emails:** Use different emails to test multiple times
- **Gmail trick:** `your-email+test1@gmail.com` all go to same inbox
- **Temp emails:** Use temp-mail.org for quick testing

---

## 🚀 Ready?

**Server is running:** http://localhost:3000

**Start testing:**
1. Open browser to http://localhost:3000
2. Watch server logs in terminal
3. Test each feature in order
4. Report any issues

**Want to proceed?** Let me know what you see! 👀

