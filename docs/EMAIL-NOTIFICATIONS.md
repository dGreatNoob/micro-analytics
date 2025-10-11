# Email Notifications System

**Status:** Welcome Email ✅ | Login Notifications 🚧 (Roadmap)

---

## 🎯 Overview

Microlytics sends email notifications to keep users informed about their account activity and help them get started.

### ✅ Implemented
- **Welcome Email** - Sent when a new user signs up

### 🚧 Roadmap (Phase 7)
- **Login Notifications** - Alert users of new logins (optional)
- **Security Alerts** - Unusual activity detection
- **Weekly Reports** - Analytics summaries
- **Account Changes** - Settings modifications
- **Billing Emails** - Payment confirmations

---

## 📧 Current Implementation: Welcome Email

### What It Does

When a user signs up via Google or GitHub OAuth:
1. Account is created in database
2. Welcome email is sent automatically
3. Email includes:
   - Personalized greeting
   - Quick start guide
   - Dashboard link
   - Privacy assurance

### Email Template

**Subject:** Welcome to Microlytics! 🎉

**Content:**
- Beautiful gradient header
- Personalized greeting
- Three key features highlighted
- Call-to-action button to dashboard
- Help resources
- Professional footer

---

## 🛠️ Technical Setup

### Email Provider: Resend

**Why Resend?**
- ✅ Modern, developer-friendly API
- ✅ Great deliverability
- ✅ Generous free tier (3,000 emails/month)
- ✅ React Email support
- ✅ Built for Next.js

**Alternatives considered:**
- SendGrid (more complex)
- Postmark (more expensive)
- AWS SES (requires AWS setup)

### Installation

```bash
npm install resend --legacy-peer-deps
```

### Configuration

Add to `.env`:
```env
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="Microlytics <noreply@microlytics.app>"
```

---

## 🔧 Files Structure

```
lib/
  └── email.ts              # Email utilities
      ├── sendEmail()       # Core sending function
      ├── sendWelcomeEmail()
      └── sendLoginNotificationEmail() (future)

lib/
  └── auth.ts               # Auth configuration
      └── signIn callback   # Triggers welcome email
```

---

## 📝 Getting Started

### 1. Sign Up for Resend

1. Go to https://resend.com
2. Sign up (free account)
3. Verify your email
4. Add your domain (optional, for production)

### 2. Get API Key

1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name: "Microlytics Dev"
4. Permission: "Sending access"
5. Copy the API key

### 3. Configure Environment

```bash
# Edit .env
RESEND_API_KEY="re_your_actual_api_key"
EMAIL_FROM="Microlytics <noreply@microlytics.app>"
```

### 4. Test Welcome Email

```bash
# Start server
make dev

# Sign up with a new account
# Check your email inbox
```

### 5. Verify in Resend Dashboard

- Go to https://resend.com/emails
- See sent emails
- Check delivery status
- View email content

---

## 🎨 Email Templates

### Welcome Email Sections

1. **Header**
   - Gradient background (blue to violet)
   - "Welcome to Microlytics! 🎉"
   - Matches landing page design

2. **Greeting**
   - Personalized with user's name
   - Friendly tone

3. **Feature Highlights**
   - Add your first site
   - Privacy-first analytics
   - Real-time monitoring

4. **Call to Action**
   - Prominent button to dashboard
   - Gradient styling

5. **Footer**
   - Help resources
   - Email preferences link
   - Unsubscribe option

### Responsive Design

- ✅ Mobile-friendly
- ✅ Dark mode compatible
- ✅ Works in all email clients
- ✅ Plain text fallback

---

## 🔮 Roadmap: Future Email Notifications

### Phase 7: Enhanced Notifications (Week 7-8)

#### 1. Login Notifications

**When:** Every login (or just new devices)

**Content:**
- Device information
- Location (from IP)
- Timestamp
- IP address (partially masked)
- "Was this you?" security check

**Implementation:**
```typescript
// After successful login
await sendLoginNotificationEmail(user.email, user.name, {
  device: parseUserAgent(req.headers['user-agent']),
  location: getLocationFromIP(req.headers['x-forwarded-for']),
  ip: req.ip,
  timestamp: new Date()
})
```

**Settings:**
- Users can opt-out
- Only notify on new devices
- Quiet hours support

#### 2. Security Alerts

**Triggers:**
- Multiple failed login attempts
- Login from new country
- Password change (when we add passwords)
- Email change
- API key created

**Example:**
```
🚨 Security Alert: Multiple Failed Login Attempts

We detected 5 failed login attempts on your account in the last hour.

Location: Tokyo, Japan
IP: 123.456.***.***
Time: Oct 11, 2025 at 3:30 PM

Actions you can take:
[Secure My Account] [Review Activity]
```

#### 3. Weekly Analytics Reports

**Content:**
- Total pageviews this week
- Top performing pages
- Traffic sources
- Visitor trends
- Key metrics

**Schedule:**
- Every Monday at 9 AM (user timezone)
- Only if account has activity
- Can customize frequency (weekly/monthly)

**Example:**
```
📊 Your Weekly Analytics Report

Hey John! Here's what happened last week:

📈 10,234 pageviews (+15% from last week)
👥 3,421 unique visitors
⏱️ 2m 34s average session

Top Pages:
1. /blog/analytics-guide - 2,456 views
2. / - 1,823 views
3. /pricing - 891 views

[View Full Report →]
```

#### 4. Account Activity Emails

**When:**
- Site added
- Site deleted
- Team member added
- Subscription upgraded/downgraded
- Payment method updated

#### 5. Onboarding Sequence (Advanced)

**Day 1:** Welcome + Getting Started  
**Day 3:** Have you installed the script?  
**Day 7:** Tips for getting more value  
**Day 14:** Feature spotlight  
**Day 30:** We'd love your feedback

---

## ⚙️ Configuration Options

### Email Preferences (Future)

Users can control:
- ✅ Welcome emails (always sent)
- ⚙️ Login notifications (on/off/new devices only)
- ⚙️ Security alerts (always sent)
- ⚙️ Weekly reports (daily/weekly/monthly/off)
- ⚙️ Product updates (on/off)
- ⚙️ Marketing emails (on/off)

### Admin Configuration

```typescript
// config/email.ts
export const emailConfig = {
  welcomeEmail: true,
  loginNotifications: {
    enabled: true,
    newDevicesOnly: true,
  },
  weeklyReports: {
    enabled: true,
    day: 'monday',
    time: '09:00',
  },
  securityAlerts: {
    enabled: true,
    threshold: 5, // failed login attempts
  }
}
```

---

## 📊 Email Analytics

### Track Email Performance

Resend provides:
- ✅ Delivery rate
- ✅ Open rate
- ✅ Click rate
- ✅ Bounce rate
- ✅ Spam complaints

### Access Analytics

```bash
# Resend dashboard
https://resend.com/emails

# Or via API
const emails = await resend.emails.list()
```

---

## 🐛 Troubleshooting

### Emails Not Sending

**Check:**
1. `RESEND_API_KEY` is set in `.env`
2. API key is valid (check Resend dashboard)
3. Check server logs for errors
4. Verify email address is valid

**Debug:**
```typescript
// lib/email.ts logs
console.log('✅ Email sent:', { to, subject })
console.log('❌ Email failed:', error)
```

### Emails Going to Spam

**Solutions:**
1. Add your domain to Resend
2. Set up SPF/DKIM records
3. Use professional "from" name
4. Include unsubscribe link
5. Warm up your domain (send gradually)

### Email Not Received

**Checklist:**
- Check spam folder
- Verify email address is correct
- Check Resend dashboard for delivery status
- Try different email provider (Gmail, Outlook, etc.)

### Development Testing

**Use test email:**
```env
# For development, use your real email
EMAIL_FROM="Microlytics Dev <your-email@gmail.com>"
```

**Check Resend logs:**
- Every email is logged
- See delivery status
- View email content

---

## 💰 Pricing

### Resend Free Tier
- 3,000 emails/month
- 100 emails/day
- All features included
- Sufficient for early stage

### Resend Pro
- $20/month
- 50,000 emails/month
- Priority support
- Custom domains

### When to Upgrade
- 100+ users signing up daily
- Need more than 3K emails/month
- Want dedicated IP

---

## 🔒 Security & Privacy

### Email Content
- ✅ No sensitive data in emails
- ✅ Use secure links with tokens
- ✅ Mask IP addresses
- ✅ Don't include passwords

### GDPR Compliance
- ✅ Include unsubscribe link
- ✅ Respect user preferences
- ✅ Delete email history on request
- ✅ Transparent about data usage

### Resend Privacy
- Email content is encrypted
- Logs retained for 90 days
- GDPR compliant
- EU data centers available

---

## 📚 Resources

- [Resend Docs](https://resend.com/docs)
- [React Email](https://react.email/)
- [Email Best Practices](https://resend.com/blog/email-best-practices)
- [Deliverability Guide](https://resend.com/blog/email-deliverability)

---

## 🚀 Quick Reference

### Send Welcome Email
```typescript
import { sendWelcomeEmail } from '@/lib/email'
await sendWelcomeEmail(user.email, user.name)
```

### Send Custom Email
```typescript
import { sendEmail } from '@/lib/email'
await sendEmail({
  to: 'user@example.com',
  subject: 'Your Custom Subject',
  html: '<h1>Hello!</h1>',
  text: 'Hello!'
})
```

### Test Email Locally
```bash
# Sign up with new account
# Check email
# Or trigger manually in Prisma Studio
```

---

## ✅ Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Welcome Email | ✅ Live | Sent on signup |
| Login Notifications | 🚧 Planned | Phase 7 |
| Security Alerts | 🚧 Planned | Phase 7 |
| Weekly Reports | 🚧 Planned | Phase 7 |
| Onboarding Sequence | 🚧 Future | Post-MVP |

**Last Updated:** 2025-10-11

---

**Next:** Get Resend API key and test welcome emails! 📧

