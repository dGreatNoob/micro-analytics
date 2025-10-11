# Getting Started: Phase 1 - Database Setup

**Goal:** Set up PostgreSQL + Prisma and define your data models

---

## 🎯 Today's Mission

By the end of this guide, you'll have:
- ✅ PostgreSQL database running
- ✅ Prisma configured and connected
- ✅ All tables created via migrations
- ✅ Test data seeded
- ✅ Prisma Studio working

---

## Step 1: Choose Your Database Host

### Option A: Local PostgreSQL (Quick Start)

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb microlytics_dev
```

### Option B: Supabase (Recommended for Production)

1. Go to [supabase.com](https://supabase.com)
2. Create new project → "Microlytics"
3. Copy connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option C: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

---

## Step 2: Install Prisma

```bash
# Install Prisma CLI and Client
npm install -D prisma
npm install @prisma/client

# Initialize Prisma
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Your database schema
- `.env` - Environment variables

---

## Step 3: Configure Database Connection

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/microlytics_dev"

# NextAuth (we'll use this later)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-one"
```

Generate a secret:
```bash
openssl rand -base64 32
```

---

## Step 4: Create Your Schema

Replace `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============= USER MANAGEMENT =============

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified DateTime?
  image         String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  sites         Site[]
  accounts      Account[]
  sessions      Session[]
}

// ============= TRACKED SITES =============

model Site {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name        String
  domain      String
  siteId      String   @unique // Public tracking ID (e.g., "site_123abc")
  timezone    String   @default("UTC")
  isPublic    Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  pageviews   Pageview[]
  events      Event[]
  
  @@index([userId])
}

// ============= ANALYTICS DATA =============

model Pageview {
  id          String   @id @default(cuid())
  siteId      String
  site        Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  
  // Page Info
  pathname    String
  referrer    String?
  
  // Visitor Info (anonymized)
  visitorId   String   // Hashed daily rotating ID
  country     String?
  device      String?  // "desktop", "mobile", "tablet"
  browser     String?  // "chrome", "firefox", etc.
  os          String?  // "windows", "macos", "linux", "ios", "android"
  
  // Timing
  timestamp   DateTime @default(now())
  duration    Int?     // Time on page in milliseconds
  
  @@index([siteId, timestamp(sort: Desc)])
  @@index([visitorId, timestamp])
  @@index([pathname, siteId])
}

model Event {
  id          String   @id @default(cuid())
  siteId      String
  site        Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  
  name        String   // Event name: "signup", "purchase", etc.
  properties  Json?    // Custom event data
  
  visitorId   String
  timestamp   DateTime @default(now())
  
  @@index([siteId, timestamp(sort: Desc)])
  @@index([name, siteId])
}

// ============= NEXTAUTH TABLES =============

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

---

## Step 5: Run Migration

```bash
# Create and apply migration
npx prisma migrate dev --name init

# This will:
# 1. Create migration files
# 2. Apply to database
# 3. Generate Prisma Client
```

You should see:
```
✔ Generated Prisma Client
✔ Migration applied: 20250101000000_init
```

---

## Step 6: Create Prisma Client Singleton

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Step 7: Seed Test Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@microlytics.app',
      name: 'Test User',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created user:', user.email)

  // Create test site
  const site = await prisma.site.create({
    data: {
      userId: user.id,
      name: 'My Test Site',
      domain: 'example.com',
      siteId: 'site_' + Math.random().toString(36).substring(2, 15),
    },
  })

  console.log('✅ Created site:', site.name)

  // Create sample pageviews
  const now = new Date()
  const pageviews = []

  for (let i = 0; i < 50; i++) {
    pageviews.push({
      siteId: site.id,
      pathname: i % 3 === 0 ? '/' : i % 3 === 1 ? '/about' : '/blog',
      referrer: i % 2 === 0 ? 'https://google.com' : null,
      visitorId: 'visitor_' + Math.floor(Math.random() * 10),
      country: ['US', 'UK', 'CA', 'DE'][Math.floor(Math.random() * 4)],
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      browser: ['chrome', 'firefox', 'safari'][Math.floor(Math.random() * 3)],
      os: ['windows', 'macos', 'linux'][Math.floor(Math.random() * 3)],
      timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    })
  }

  await prisma.pageview.createMany({
    data: pageviews,
  })

  console.log('✅ Created 50 sample pageviews')

  // Create sample events
  await prisma.event.createMany({
    data: [
      {
        siteId: site.id,
        name: 'signup',
        visitorId: 'visitor_1',
        properties: { plan: 'pro' },
        timestamp: new Date(),
      },
      {
        siteId: site.id,
        name: 'button_click',
        visitorId: 'visitor_2',
        properties: { button: 'cta' },
        timestamp: new Date(),
      },
    ],
  })

  console.log('✅ Created sample events')
  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Install tsx:
```bash
npm install -D tsx
```

Run seed:
```bash
npx prisma db seed
```

---

## Step 8: Test with Prisma Studio

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

You should see:
- User table with test user
- Site table with test site  
- Pageview table with 50 entries
- Event table with 2 events

---

## Step 9: Test Database Queries

Create `scripts/test-db.ts`:

```typescript
import { prisma } from '../lib/prisma'

async function testQueries() {
  console.log('🔍 Testing database queries...\n')

  // Get all users
  const users = await prisma.user.findMany({
    include: {
      sites: true,
    },
  })
  console.log('Users:', users.length)

  // Get pageviews for a site
  const site = await prisma.site.findFirst()
  if (site) {
    const pageviews = await prisma.pageview.count({
      where: { siteId: site.id },
    })
    console.log('Pageviews:', pageviews)

    // Top pages
    const topPages = await prisma.pageview.groupBy({
      by: ['pathname'],
      where: { siteId: site.id },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    })
    console.log('\nTop Pages:')
    topPages.forEach((p) => {
      console.log(`  ${p.pathname}: ${p._count.id} views`)
    })
  }

  console.log('\n✅ Queries successful!')
}

testQueries()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run:
```bash
npx tsx scripts/test-db.ts
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL database running
- [ ] `prisma/schema.prisma` created
- [ ] Migration applied successfully
- [ ] Prisma Client generated
- [ ] Seed data created
- [ ] Prisma Studio opens
- [ ] Test queries work

---

## 🎉 Success!

You now have:
- ✅ Complete database schema
- ✅ All tables created
- ✅ Test data to work with
- ✅ Type-safe database client

## 🚀 Next Steps

See `ROADMAP.md` → Phase 2: Authentication

Or jump straight to:
```bash
npm install next-auth
```

---

## 🐛 Troubleshooting

### "Can't reach database server"
- Check DATABASE_URL in `.env`
- Verify PostgreSQL is running: `brew services list`

### "Migration failed"
- Drop database: `dropdb microlytics_dev`
- Recreate: `createdb microlytics_dev`
- Retry migration

### Prisma Studio won't open
- Kill existing process: `killall -9 prisma`
- Restart: `npx prisma studio`

---

**Need help?** Open an issue or check Prisma docs: https://prisma.io/docs

