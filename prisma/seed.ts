import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@microlytics.app' },
    update: {},
    create: {
      email: 'test@microlytics.app',
      name: 'Test User',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created user:', user.email)

  // Create test site
  const site = await prisma.site.upsert({
    where: { siteId: 'site_test123' },
    update: {},
    create: {
      userId: user.id,
      name: 'My Test Site',
      domain: 'example.com',
      siteId: 'site_test123',
    },
  })

  console.log('✅ Created site:', site.name)

  // Delete old pageviews for this site to avoid duplicates
  await prisma.pageview.deleteMany({
    where: { siteId: site.id },
  })

  // Create sample pageviews
  const now = new Date()
  const pageviews = []

  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 7)
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000))

    pageviews.push({
      siteId: site.id,
      pathname: ['/','/', '/about', '/blog', '/pricing', '/docs'][Math.floor(Math.random() * 6)],
      referrer: i % 3 === 0 ? 'https://google.com' : i % 3 === 1 ? 'https://twitter.com' : null,
      visitorId: 'visitor_' + Math.floor(Math.random() * 20),
      country: ['US', 'UK', 'CA', 'DE', 'FR', 'JP'][Math.floor(Math.random() * 6)],
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      browser: ['chrome', 'firefox', 'safari', 'edge'][Math.floor(Math.random() * 4)],
      os: ['windows', 'macos', 'linux', 'ios', 'android'][Math.floor(Math.random() * 5)],
      timestamp,
      duration: Math.floor(Math.random() * 120000) + 10000, // 10s to 2min
    })
  }

  await prisma.pageview.createMany({
    data: pageviews,
  })

  console.log('✅ Created 100 sample pageviews')

  // Create sample events
  await prisma.event.deleteMany({
    where: { siteId: site.id },
  })

  await prisma.event.createMany({
    data: [
      {
        siteId: site.id,
        name: 'signup',
        visitorId: 'visitor_1',
        properties: { plan: 'pro', source: 'landing_page' },
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        siteId: site.id,
        name: 'button_click',
        visitorId: 'visitor_2',
        properties: { button: 'cta', location: 'hero' },
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      },
      {
        siteId: site.id,
        name: 'purchase',
        visitorId: 'visitor_3',
        properties: { amount: 99, plan: 'business' },
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
    ],
  })

  console.log('✅ Created sample events')
  console.log('\n✨ Seeding complete!\n')
  console.log('📊 You can now:')
  console.log('   - Run "npx prisma studio" to view your data')
  console.log('   - Start the dev server with "npm run dev"')
  console.log(`   - Test site ID: ${site.siteId}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

