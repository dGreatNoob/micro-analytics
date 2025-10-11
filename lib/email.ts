import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'Microlytics <noreply@microlytics.app>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY not set. Email not sent:', { to, subject })
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('❌ Email send error:', error)
      return { success: false, error }
    }

    console.log('✅ Email sent:', { to, subject, id: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('❌ Email send failed:', error)
    return { success: false, error }
  }
}

// Welcome Email Template
export async function sendWelcomeEmail(email: string, name: string | null) {
  const userName = name || email.split('@')[0]
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Microlytics</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                Welcome to Microlytics! 🎉
              </h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hey <strong>${userName}</strong>! 👋
              </p>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thanks for signing up! We're excited to help you track your website analytics in a privacy-first way.
              </p>
              
              <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Here's what you can do next:
              </p>
              
              <!-- Feature List -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #f3f4f6; border-radius: 8px; margin-bottom: 10px;">
                    <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.5;">
                      <strong style="color: #3b82f6;">📊 Add Your First Site</strong><br>
                      <span style="color: #6b7280;">Create a site and get your tracking script in seconds</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f3f4f6; border-radius: 8px; margin: 10px 0;">
                    <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.5;">
                      <strong style="color: #8b5cf6;">🔒 100% Privacy-First</strong><br>
                      <span style="color: #6b7280;">No cookies, no tracking bloat, GDPR compliant</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f3f4f6; border-radius: 8px; margin-top: 10px;">
                    <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.5;">
                      <strong style="color: #10b981;">⚡ Real-Time Analytics</strong><br>
                      <span style="color: #6b7280;">See what's happening on your site right now</span>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Need help getting started? Check out our <a href="${APP_URL}/docs" style="color: #3b82f6; text-decoration: none;">documentation</a> or reply to this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; text-align: center;">
                <strong>Microlytics</strong> - Privacy-First Analytics
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                You're receiving this because you signed up for Microlytics.<br>
                <a href="${APP_URL}/settings/notifications" style="color: #3b82f6; text-decoration: none;">Manage email preferences</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
Welcome to Microlytics, ${userName}!

Thanks for signing up! We're excited to help you track your website analytics in a privacy-first way.

Here's what you can do next:
- Add your first site and get your tracking script
- Enjoy 100% privacy-first analytics (no cookies, GDPR compliant)
- See real-time analytics on your dashboard

Get started: ${APP_URL}/dashboard

Need help? Visit our docs at ${APP_URL}/docs or reply to this email.

---
Microlytics - Privacy-First Analytics
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Microlytics! 🎉',
    html,
    text,
  })
}

// Login Notification Email (for future use)
export async function sendLoginNotificationEmail(
  email: string,
  name: string | null,
  loginInfo: {
    device?: string
    location?: string
    ip?: string
    timestamp: Date
  }
) {
  const userName = name || email.split('@')[0]
  const ipMasked = loginInfo.ip ? loginInfo.ip.split('.').slice(0, 2).join('.') + '.***' : 'Unknown'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Login to Microlytics</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">New Login Detected 🔐</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px;">
                Hey <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px;">
                Someone just logged into your Microlytics account. Here are the details:
              </p>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #6b7280; font-size: 14px;">📍 Location:</strong>
                    <span style="color: #1f2937; font-size: 14px;"> ${loginInfo.location || 'Unknown'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #6b7280; font-size: 14px;">💻 Device:</strong>
                    <span style="color: #1f2937; font-size: 14px;"> ${loginInfo.device || 'Unknown'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #6b7280; font-size: 14px;">🕐 Time:</strong>
                    <span style="color: #1f2937; font-size: 14px;"> ${loginInfo.timestamp.toLocaleString()}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #6b7280; font-size: 14px;">🌐 IP:</strong>
                    <span style="color: #1f2937; font-size: 14px;"> ${ipMasked}</span>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 15px;">
                <strong>Was this you?</strong> If so, you can safely ignore this email.
              </p>
              
              <p style="margin: 0 0 30px; color: #dc2626; font-size: 15px;">
                <strong>Wasn't you?</strong> Please secure your account immediately.
              </p>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/settings/security" style="display: inline-block; padding: 12px 28px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                      Secure My Account
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Microlytics Security Team<br>
                <a href="${APP_URL}/settings/notifications" style="color: #3b82f6; text-decoration: none;">Manage email preferences</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
New Login to Microlytics

Hey ${userName},

Someone just logged into your Microlytics account:

📍 Location: ${loginInfo.location || 'Unknown'}
💻 Device: ${loginInfo.device || 'Unknown'}
🕐 Time: ${loginInfo.timestamp.toLocaleString()}
🌐 IP: ${ipMasked}

Was this you? If so, you can safely ignore this email.

Wasn't you? Secure your account immediately: ${APP_URL}/settings/security

---
Microlytics Security Team
  `

  return sendEmail({
    to: email,
    subject: '🔐 New login to your Microlytics account',
    html,
    text,
  })
}

