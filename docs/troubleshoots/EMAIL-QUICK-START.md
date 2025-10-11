# 📧 Welcome Email - Quick Start

**Time:** 5 minutes | **Cost:** Free (3,000 emails/month)

---

## ✅ What's Already Done

- ✅ Email system installed (Resend)
- ✅ Welcome email template created
- ✅ Auth integration configured
- ✅ Beautiful HTML + plain text emails

---

## 🚀 Setup in 3 Steps

### Step 1: Get Resend API Key (2 min)

1. Go to https://resend.com
2. Sign up with Google/GitHub
3. Go to https://resend.com/api-keys
4. Click "Create API Key"
5. Name: "Microlytics Dev"
6. Copy the key (starts with `re_`)

### Step 2: Add to Environment (1 min)

Edit `.env`:

```bash
# Add these lines
RESEND_API_KEY="re_your_actual_key_here"
EMAIL_FROM="Microlytics <noreply@microlytics.app>"
```

### Step 3: Test It (2 min)

```bash
# Restart server
make dev

# Sign up with a NEW email (not one you've used before)
# Check your inbox for welcome email!
```

---

## 📧 What the Email Looks Like

**Subject:** Welcome to Microlytics! 🎉

**Preview:**
```
Hey John! 👋

Thanks for signing up! We're excited to help you track 
your website analytics in a privacy-first way.

Here's what you can do next:

📊 Add Your First Site
   Create a site and get your tracking script in seconds

🔒 100% Privacy-First  
   No cookies, no tracking bloat, GDPR compliant

⚡ Real-Time Analytics
   See what's happening on your site right now

[Go to Dashboard →]
```

Beautiful gradient header + fully responsive!

---

## 🧪 Testing Checklist

- [ ] Resend API key added to `.env`
- [ ] Server restarted
- [ ] Signed up with new email
- [ ] Welcome email received (check spam!)
- [ ] Email looks good on mobile/desktop
- [ ] Dashboard link works

---

## 🐛 Troubleshooting

### Email Not Sending

**Check server logs:**
```bash
# Look for:
✅ Email sent: { to: 'user@example.com', subject: '...' }

# Or error:
❌ Email send error: ...
⚠️  RESEND_API_KEY not set. Email not sent
```

**Solutions:**
1. Verify `RESEND_API_KEY` in `.env`
2. Restart server: `make dev`
3. Check Resend dashboard: https://resend.com/emails

### Email in Spam

**Normal for development!**
- Resend uses shared IPs for free tier
- Add your domain in production for better delivery
- Check spam folder during testing

### Not Received

1. Wait 1-2 minutes
2. Check spam folder
3. Verify email in Resend dashboard
4. Try different email provider (Gmail vs Outlook)

---

## 📊 View Sent Emails

**Resend Dashboard:**
https://resend.com/emails

You can see:
- All sent emails
- Delivery status
- Email content preview
- Open/click rates (if tracking enabled)

---

## 🎯 When Emails Are Sent

### Currently Implemented

**Welcome Email:**
- ✅ Triggered on first OAuth sign-in
- ✅ Only sent to new users
- ✅ Not sent on subsequent logins

### Future (Phase 7)

**Login Notifications:**
- Every login (or just new devices)
- Includes device, location, IP
- "Was this you?" security check

**See full roadmap:** `docs/EMAIL-NOTIFICATIONS.md`

---

## 💡 Pro Tips

### Development

```env
# Use your real email during dev
EMAIL_FROM="Microlytics Dev <your-email@gmail.com>"

# This ensures emails don't go to spam during testing
```

### Testing Multiple Emails

```bash
# Gmail trick: add +test to your email
your-email+test1@gmail.com  # Goes to your-email@gmail.com
your-email+test2@gmail.com  # Also goes to your-email@gmail.com

# Or use temp email services:
# - temp-mail.org
# - guerrillamail.com
```

### Production

1. Add your domain to Resend
2. Set up SPF/DKIM records
3. Use branded email: `noreply@your-domain.com`
4. Warm up domain (gradual sending)

---

## 📈 Next Steps

### Phase 2 Complete! ✅

You now have:
- ✅ Authentication (Google + GitHub)
- ✅ Welcome emails
- ✅ Protected dashboard
- ✅ User management

### Coming Next

**Phase 3:** Tracking Script (m.js)
- Build analytics tracking script
- Anonymous visitor tracking
- Custom events

**Phase 4:** Data Ingestion API
- `/api/track` endpoint
- Store pageviews
- Real-time processing

---

## 🎉 Success!

If you see the welcome email, you're all set!

**Test it:** Sign up at http://localhost:3000 and check your inbox 📧

---

**Questions?** Check `docs/EMAIL-NOTIFICATIONS.md` for full documentation.

