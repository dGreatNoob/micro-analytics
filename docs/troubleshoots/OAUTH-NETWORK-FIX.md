# OAuth Network Access Fix

**Issue:** OAuth login (Google/GitHub) doesn't work from other devices on the network  
**Date Fixed:** October 13, 2025  
**Status:** ✅ Resolved

---

## 🐛 Problem

When accessing the app from another device on the network (e.g., `http://192.168.100.87:3000`):
- **Google OAuth:** Stuck on OAuth screen, can't reach dashboard
- **GitHub OAuth:** Stuck on loading

**Root Cause:**
- `NEXTAUTH_URL` was hardcoded to `localhost:3000`
- OAuth providers redirect to localhost, which doesn't exist on other devices
- Redirect callback sent users to homepage instead of dashboard

---

## ✅ Solution Applied

### 1. Updated NEXTAUTH_URL (.env)
```bash
# Before
NEXTAUTH_URL="http://localhost:3000"

# After
NEXTAUTH_URL="http://192.168.100.87:3000"
```

### 2. Fixed Redirect Callback (lib/auth.ts)
```typescript
// Changed from:
return baseUrl  // ❌ Goes to homepage

// Changed to:
return `${baseUrl}/dashboard`  // ✅ Goes to dashboard
```

### 3. Update OAuth Provider Callback URLs

#### Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   http://192.168.100.87:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
4. Click **Save**

#### GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Select your OAuth App
3. Update **Authorization callback URL**:
   ```
   http://192.168.100.87:3000/api/auth/callback/github
   ```
4. Add another app for localhost (or use comma-separated):
   ```
   http://localhost:3000/api/auth/callback/github
   ```
5. Click **Update application**

---

## 🧪 Testing

After updating OAuth providers:

1. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   make dev
   ```

2. **Test on main device (localhost):**
   ```bash
   # Should still work
   http://localhost:3000
   ```

3. **Test on other device (network IP):**
   ```bash
   # From phone/tablet on same WiFi
   http://192.168.100.87:3000
   ```

4. **Expected flow:**
   - Click "Sign in with Google" or "Sign in with GitHub"
   - Authorize on OAuth screen
   - ✅ Redirected to `/dashboard`
   - ✅ Session persists

---

## 🔄 For Production

When deploying to production (Vercel):

1. **Set NEXTAUTH_URL to production domain:**
   ```bash
   NEXTAUTH_URL="https://microlytics.app"
   ```

2. **Update OAuth callback URLs:**
   ```
   Google: https://microlytics.app/api/auth/callback/google
   GitHub: https://microlytics.app/api/auth/callback/github
   ```

3. **Keep localhost for development:**
   - Create separate OAuth apps for dev/prod, OR
   - Add both URLs to the same app (Google allows multiple, GitHub needs separate)

---

## 📝 Environment Variable Reference

### Development (Local Network)
```env
NEXTAUTH_URL="http://192.168.100.87:3000"
NEXT_PUBLIC_APP_URL="http://192.168.100.87:3000"
```

### Development (Localhost Only)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production
```env
NEXTAUTH_URL="https://microlytics.app"
NEXT_PUBLIC_APP_URL="https://microlytics.app"
```

---

## 🔍 How to Find Your Network IP

### Linux/Mac
```bash
# Method 1
ip addr show | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d'/' -f1 | head -1

# Method 2
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
```

### Windows
```cmd
ipconfig | findstr IPv4
```

### Quick Check
```bash
# Your devices must be on the same WiFi network
# Common patterns:
192.168.1.x    # Common home routers
192.168.0.x    # Alternative
192.168.100.x  # Your current setup
10.0.0.x       # Some routers
```

---

## ⚠️ Troubleshooting

### Issue: Still stuck on OAuth screen
**Solution:** Clear browser cookies and try again
```bash
# Or use incognito/private mode
```

### Issue: "Redirect URI mismatch" error
**Solution:** Double-check OAuth callback URLs match exactly
```bash
# Must match NEXTAUTH_URL in .env
http://192.168.100.87:3000/api/auth/callback/google
http://192.168.100.87:3000/api/auth/callback/github
```

### Issue: Works on one device, not another
**Solution:** Ensure all devices are on the same WiFi network
```bash
# Check IP on each device
# Must be in same subnet (e.g., 192.168.100.x)
```

### Issue: Session not persisting
**Solution:** Check cookie domain settings
```typescript
// In auth.ts, session config:
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
// Cookies are handled automatically by NextAuth
```

---

## 📚 Related Docs

- [NextAuth.js Configuration](https://authjs.dev/guides/configuring-oauth-providers)
- [Google OAuth Setup](https://console.cloud.google.com/apis/credentials)
- [GitHub OAuth Apps](https://github.com/settings/developers)

---

**Status:** ✅ **FIXED**  
**Next Step:** Update OAuth provider callback URLs, then test on network devices

