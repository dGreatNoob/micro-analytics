# 🚀 Deployment Guide

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] **Build successful**: `npm run build` completes without errors
- [ ] **All routes working**: Test landing, auth, and dashboard pages
- [ ] **Theme switching**: Dark/light mode toggle works
- [ ] **Responsive design**: Test on mobile, tablet, desktop
- [ ] **Authentication flow**: Login/signup redirects properly
- [ ] **Protected routes**: Dashboard requires authentication

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest and most optimized platform for Next.js applications.

#### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Deploy to production
vercel --prod
```

#### GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and deploy

#### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Option 2: Netlify

#### Build Settings

```bash
Build command: npm run build
Publish directory: .next
Node version: 18
```

#### Environment Variables

Add these in Netlify dashboard:
- `NEXT_PUBLIC_APP_URL=https://your-app.netlify.app`

### Option 3: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 4: Self-Hosted

#### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t micro-analytics .
docker run -p 3000:3000 micro-analytics
```

## 🔧 Environment Variables

Create a `.env.local` file for local development:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication (when you add real auth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database (when you add a database)
DATABASE_URL=your-database-url

# Analytics (when you add real analytics)
MICROLYTICS_API_URL=your-api-url
```

For production, set these in your hosting platform's environment variables section.

## 📊 Performance Optimization

### Build Analysis

```bash
# Analyze bundle size
npm run build
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Image Optimization

The app uses Next.js Image component for optimized images:
- Images are automatically optimized
- WebP format used when supported
- Lazy loading enabled by default

### Caching Strategy

- **Static pages**: Pre-rendered at build time
- **Dashboard pages**: Client-side rendered with caching
- **Assets**: Cached with appropriate headers

## 🔐 Security Considerations

### Production Checklist

- [ ] **Environment variables**: Never commit `.env` files
- [ ] **HTTPS**: Always use HTTPS in production
- [ ] **CORS**: Configure CORS for your domain
- [ ] **Rate limiting**: Add rate limiting to API routes
- [ ] **Content Security Policy**: Add CSP headers

### Security Headers

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## 📈 Monitoring & Analytics

### Vercel Analytics

If using Vercel, enable Vercel Analytics:

```bash
npm install @vercel/analytics
```

Already included in the app!

### Error Monitoring

Add error monitoring:

```bash
npm install @sentry/nextjs
```

### Performance Monitoring

```bash
npm install @vercel/speed-insights
```

## 🚨 Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build
```

#### Routes Not Working

- Check middleware configuration
- Verify route group structure
- Ensure all imports are correct

#### Authentication Issues

- Check cookie settings
- Verify middleware logic
- Test on different browsers

#### Styling Issues

- Clear browser cache
- Check Tailwind CSS configuration
- Verify component imports

### Debug Mode

Enable debug logging:

```bash
# Add to .env.local
DEBUG=*
```

## 📱 Mobile Deployment

### PWA Support (Optional)

Add PWA capabilities:

```bash
npm install next-pwa
```

### App Store Deployment

For mobile app deployment:
- Use Expo for React Native
- Or wrap with Capacitor/Cordova

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📊 Post-Deployment

### Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

### Monitoring Setup

1. **Uptime monitoring**: Use UptimeRobot or Pingdom
2. **Error tracking**: Set up Sentry or similar
3. **Performance monitoring**: Use Vercel Analytics or Google Analytics
4. **User analytics**: Add your own analytics tracking

## 🎯 Domain & DNS

### Custom Domain

1. **Add domain in Vercel**: Go to Project Settings → Domains
2. **Configure DNS**: Add CNAME record pointing to Vercel
3. **SSL certificate**: Automatically provisioned by Vercel

### Subdomain Setup

For staging:
- `staging.yourdomain.com` → Staging deployment
- `yourdomain.com` → Production deployment

## ✅ Go Live Checklist

- [ ] **Code pushed** to main branch
- [ ] **Build successful** on hosting platform
- [ ] **Domain configured** and SSL active
- [ ] **Environment variables** set in production
- [ ] **Analytics tracking** enabled
- [ ] **Error monitoring** configured
- [ ] **Performance monitoring** active
- [ ] **Backup strategy** in place
- [ ] **Documentation updated** with live URLs

## 🆘 Support

If you encounter issues:

1. **Check logs** in your hosting platform
2. **Review this guide** for common solutions
3. **Open an issue** on GitHub
4. **Check Next.js docs** for framework-specific issues

---

**Happy Deploying! 🚀**

*Last updated: October 9, 2025*
