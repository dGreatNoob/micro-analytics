# Authentication Setup Guide

**Phase 2.1 Complete!** ✅ NextAuth.js with Google, GitHub & Email/Password Auth

> **Important:** This app uses **JWT sessions** (not database sessions). See [`/AUTH-FIX-JWT-SESSIONS.md`](../AUTH-FIX-JWT-SESSIONS.md) for details.

---

## 🎯 What's Been Set Up

- ✅ NextAuth.js v5 installed
- ✅ Prisma adapter configured (for OAuth)
- ✅ Google OAuth provider
- ✅ GitHub OAuth provider
- ✅ Email/Password authentication (Credentials provider)
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT session management (30-day expiry)
- ✅ Sign-in page at `/auth/signin`
- ✅ Protected routes middleware
- ✅ Dashboard page
- ✅ Automatic redirect to dashboard after signin

---

## 🔐 Getting OAuth Credentials

### Google OAuth Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a Project:**
   - Click "Select a project" → "New Project"
   - Name: "Microlytics"
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Microlytics Auth"

5. **Configure OAuth Consent Screen:**
   - User Type: External
   - App name: Microlytics
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com

6. **Add Authorized Redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   ```

7. **Copy Credentials:**
   - Copy "Client ID" → `GOOGLE_CLIENT_ID`
   - Copy "Client Secret" → `GOOGLE_CLIENT_SECRET`

---

### GitHub OAuth Setup

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/developers

2. **Create OAuth App:**
   - Click "OAuth Apps" → "New OAuth App"
   - Application name: "Microlytics"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

3. **Generate Client Secret:**
   - Click "Generate a new client secret"

4. **Copy Credentials:**
   - Copy "Client ID" → `GITHUB_CLIENT_ID`
   - Copy "Client secret" → `GITHUB_CLIENT_SECRET`

---

## ⚙️ Configure Environment Variables

Edit `.env`:

```bash
# OAuth Providers
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"

GITHUB_CLIENT_ID="your-actual-github-client-id"
GITHUB_CLIENT_SECRET="your-actual-github-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## 🧪 Test Authentication

### 1. Start Dev Server

```bash
make dev
```

### 2. Test Sign-In Flow

1. Go to http://localhost:3000
2. Click "Sign in" in header
3. Click "Continue with Google" or "Continue with GitHub"
4. Authorize the application
5. Should redirect to `/dashboard`

### 3. Check Database

```bash
npx prisma studio
```

You should see:
- New user in `User` table
- Session in `Session` table
- Account in `Account` table (OAuth link)

---

## 📂 Files Created

### Authentication
- ✅ `lib/auth.ts` - NextAuth configuration
- ✅ `app/api/auth/[...nextauth]/route.ts` - Auth API routes
- ✅ `middleware.ts` - Route protection
- ✅ `types/next-auth.d.ts` - TypeScript types

### Pages
- ✅ `app/auth/signin/page.tsx` - Sign-in page
- ✅ `app/auth/error/page.tsx` - Error page
- ✅ `app/dashboard/page.tsx` - Dashboard (protected)

### Updated
- ✅ `components/marketing/header.tsx` - Added sign-in links

---

## 🔒 Protected Routes

These routes require authentication:
- `/dashboard` - Main dashboard
- `/sites/*` - Site management (when created)
- `/settings/*` - Settings (when created)

Middleware automatically redirects to `/auth/signin` if not logged in.

---

## 🎨 Sign-In Page Features

- ✅ Google OAuth button
- ✅ GitHub OAuth button
- ✅ Beautiful gradient background
- ✅ Glassmorphism design
- ✅ Responsive layout
- ✅ Error handling
- ✅ Privacy policy links

---

## 🧩 How It Works

### Authentication Flow

```
1. User clicks "Sign in"
   ↓
2. Redirects to /auth/signin
   ↓
3. User chooses OAuth provider
   ↓
4. OAuth provider authenticates
   ↓
5. Callback to /api/auth/callback/[provider]
   ↓
6. NextAuth creates/updates user in database
   ↓
7. Creates session
   ↓
8. Redirects to /dashboard
```

### JWT Sessions

- **Strategy:** JWT sessions (works with all providers)
- **Storage:** Encrypted JWT tokens in httpOnly cookies
- **Expiry:** 30 days (configurable)
- **Security:** Encrypted with NEXTAUTH_SECRET
- **Account table:** Links OAuth accounts to users (OAuth only)

---

## 🐛 Troubleshooting

### "Configuration Error"
- Check `.env` has valid OAuth credentials
- Ensure `NEXTAUTH_SECRET` is set

### "Access Denied"
- Check OAuth app is not restricted
- Verify redirect URIs match exactly

### "Callback URL Mismatch"
- Update OAuth app settings
- Check `NEXTAUTH_URL` in `.env`

### Session Not Persisting
- Clear cookies
- Restart dev server
- Check database has Session table

### Can't Sign Out
- Clear browser cookies
- Check middleware configuration

---

## 🚀 Next Steps

Now that auth is working, you can:

1. **Add Site Management** (Phase 6)
   - Create new site form
   - Generate tracking script
   - Site settings page

2. **Build Analytics Dashboard** (Phase 5)
   - Connect real data
   - Add charts and graphs
   - Real-time updates

3. **Create Tracking Script** (Phase 3)
   - Build `m.js` script
   - Event ingestion API
   - Anonymous visitor tracking

---

## 📚 Additional Resources

- [NextAuth.js Docs](https://authjs.dev/)
- [Google OAuth Guide](https://support.google.com/cloud/answer/6158849)
- [GitHub OAuth Guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)

---

## 🔐 Security Best Practices

✅ **Implemented:**
- Database sessions (not JWT)
- CSRF protection (NextAuth built-in)
- Secure cookies (httpOnly, sameSite)
- OAuth state validation

⚠️ **TODO for Production:**
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Implement account verification
- [ ] Add 2FA (optional)
- [ ] Set up email notifications

---

## 📊 Test Coverage

You can test:
- ✅ Sign in with Google
- ✅ Sign in with GitHub  
- ✅ Protected route redirection
- ✅ Session persistence
- ✅ Sign out functionality
- ✅ Error handling

---

**Ready to test?** 

1. Get OAuth credentials (15 min)
2. Update `.env` file
3. Restart server: `make dev`
4. Visit http://localhost:3000 and click "Sign in"

🎉 **Authentication is ready!**

