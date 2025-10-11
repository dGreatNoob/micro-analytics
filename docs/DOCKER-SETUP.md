# Docker Setup Guide

**Architecture:** Docker for Database + Redis | Next.js runs on host

---

## 🎯 Why This Setup?

✅ **Clean database** - No PostgreSQL installation needed
✅ **Fast development** - Next.js hot reload at native speed  
✅ **Easy team onboarding** - One command to start everything
✅ **Production parity** - Same database version everywhere
✅ **Redis included** - For caching analytics queries

---

## 🚀 Quick Start

### First Time Setup

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Run complete setup (installs deps, starts DB, runs migrations, seeds data)
make setup

# 3. Start development server
make dev
```

That's it! 🎉

---

## 📋 Available Commands

### Database
```bash
make db-up        # Start PostgreSQL & Redis containers
make db-down      # Stop containers  
make db-reset     # Reset database (WARNING: deletes all data)
make db-migrate   # Run Prisma migrations
make db-seed      # Seed with test data
make studio       # Open Prisma Studio UI
```

### Development
```bash
make dev          # Start Next.js (run this in a separate terminal)
make lint         # Run ESLint
make test         # Run tests
```

### Production
```bash
make build        # Build for production
```

### Utilities
```bash
make logs         # View container logs
make db-backup    # Backup database to backups/
make db-restore FILE=path/to/backup.sql  # Restore from backup
make clean        # Remove everything (containers, volumes, node_modules)
```

---

## 🐳 What's Running?

After `make db-up`, you'll have:

| Service | Port | Access | Purpose |
|---------|------|--------|---------|
| **PostgreSQL** | 5432 | localhost:5432 | Main database |
| **Redis** | 6379 | localhost:6379 | Caching layer |
| **Adminer** | 8080 | http://localhost:8080 | Database UI |

### Database Connection

```
Server:   postgres
User:     microlytics  
Password: microlytics_dev_password
Database: microlytics_dev
```

---

## 📂 Project Structure

```
micro-analytics/
├── docker-compose.yml          # Docker services config
├── docker/
│   └── postgres/
│       └── init.sql            # Database initialization
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration files
│   └── seed.ts                 # Seed data script
├── .env                        # Environment variables
├── .env.example                # Template
└── Makefile                    # Development commands
```

---

## 🔧 Configuration

### Environment Variables

Edit `.env`:

```env
# Database (Docker)
DATABASE_URL="postgresql://microlytics:microlytics_dev_password@localhost:5432/microlytics_dev"

# Redis (Docker)  
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="generate-this"
NEXTAUTH_URL="http://localhost:3000"
```

Generate secrets:
```bash
openssl rand -base64 32
```

### Docker Compose Services

The `docker-compose.yml` includes:

1. **PostgreSQL 16** (Alpine Linux - lightweight)
   - Automatic health checks
   - Persistent data volume
   - UTF-8 encoding
   - Extensions: uuid-ossp, pg_stat_statements

2. **Redis 7** (Alpine Linux)
   - Persistent storage (AOF)
   - Health checks
   - Ready for caching

3. **Adminer** (Optional database UI)
   - Alternative to Prisma Studio
   - Lightweight web interface

---

## 🎓 Common Workflows

### Starting Fresh Each Day

```bash
# Terminal 1: Start database
make db-up

# Terminal 2: Start Next.js
make dev
```

### Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create and apply migration
make db-migrate

# Migration will prompt for name:
# "Migration name:" › add_user_preferences
```

### Resetting Everything

```bash
# WARNING: Deletes all data!
make db-reset
```

### Viewing Database

```bash
# Option 1: Prisma Studio (recommended)
make studio
# Opens at http://localhost:5555

# Option 2: Adminer (if running)
# Go to http://localhost:8080
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 5432
lsof -i :5432

# Kill it
kill -9 <PID>

# Or change port in docker-compose.yml:
ports:
  - '5433:5432'  # Use 5433 on host
```

### Container Won't Start

```bash
# View logs
make logs

# Or specific service
docker-compose logs postgres

# Reset everything
make db-down
docker-compose up -d
```

### Database Connection Refused

```bash
# Wait for it to be ready
docker-compose exec postgres pg_isready -U microlytics

# Should output:
# /var/run/postgresql:5432 - accepting connections
```

### Prisma Can't Connect

```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test connection
npx prisma db execute --stdin <<< "SELECT 1"
```

### Need to Rebuild Containers

```bash
make db-down
docker-compose up -d --build
```

---

## 🚀 Production Docker Setup

For production, you CAN containerize the whole app:

```yaml
# docker-compose.prod.yml
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://...
      - NODE_ENV=production
    depends_on:
      - postgres
```

But typically you'd deploy to:
- **Vercel** (Next.js hosting)
- **Neon/Supabase** (PostgreSQL)
- **Upstash** (Redis)

---

## 📊 Monitoring

### Database Stats

```bash
# View active connections
docker-compose exec postgres psql -U microlytics -d microlytics_dev -c "SELECT count(*) FROM pg_stat_activity;"

# View table sizes
docker-compose exec postgres psql -U microlytics -d microlytics_dev -c "SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC;"
```

### Container Resources

```bash
# View resource usage
docker stats microlytics-db microlytics-redis
```

---

## 🔒 Security Notes

**Development:**
- ⚠️ Default passwords in docker-compose.yml (OK for local dev)
- ⚠️ Ports exposed to localhost (OK for local dev)

**Production:**
- ✅ Use strong passwords
- ✅ Use environment variables
- ✅ Don't expose ports publicly
- ✅ Use connection pooling (PgBouncer)
- ✅ Enable SSL for database connections

---

## 📚 Additional Resources

- [Docker Docs](https://docs.docker.com/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Prisma with Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

---

**Next Steps:** See `GETTING-STARTED.md` for Prisma setup

