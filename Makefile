# Microlytics - Development Commands
.PHONY: help dev db-up db-down db-reset db-migrate db-seed studio test build

# Default command - show help
help:
	@echo "🚀 Microlytics Development Commands"
	@echo ""
	@echo "Database:"
	@echo "  make db-up       - Start PostgreSQL & Redis containers"
	@echo "  make db-down     - Stop containers"
	@echo "  make db-reset    - Reset database (drop & recreate)"
	@echo "  make db-migrate  - Run Prisma migrations"
	@echo "  make db-seed     - Seed database with test data"
	@echo "  make studio      - Open Prisma Studio"
	@echo ""
	@echo "Development:"
	@echo "  make dev         - Start Next.js dev server"
	@echo "  make setup       - First-time setup (containers + migrations + seed)"
	@echo ""
	@echo "Testing:"
	@echo "  make test        - Run tests"
	@echo "  make lint        - Run ESLint"
	@echo ""
	@echo "Production:"
	@echo "  make build       - Build for production"
	@echo ""

# Start database containers
db-up:
	@echo "🐳 Starting PostgreSQL & Redis..."
	docker-compose up -d postgres redis
	@echo "⏳ Waiting for PostgreSQL to be ready..."
	@sleep 3
	@docker-compose exec -T postgres pg_isready -U microlytics -d microlytics_dev
	@echo "✅ Database is ready!"
	@echo "📊 Adminer UI: http://localhost:8080"
	@echo "   Server: postgres"
	@echo "   User: microlytics"
	@echo "   Password: microlytics_dev_password"
	@echo "   Database: microlytics_dev"

# Stop containers
db-down:
	@echo "🛑 Stopping containers..."
	docker-compose down

# Reset database (WARNING: deletes all data)
db-reset:
	@echo "⚠️  WARNING: This will delete ALL data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "🗑️  Resetting database..."; \
		docker-compose down -v; \
		docker-compose up -d postgres redis; \
		sleep 3; \
		npx prisma migrate dev --name reset; \
		npx prisma db seed; \
		echo "✅ Database reset complete!"; \
	else \
		echo "❌ Cancelled"; \
	fi

# Run Prisma migrations
db-migrate:
	@echo "🔄 Running migrations..."
	npx prisma migrate dev

# Seed database
db-seed:
	@echo "🌱 Seeding database..."
	npx prisma db seed

# Open Prisma Studio
studio:
	@echo "🎨 Opening Prisma Studio..."
	npx prisma studio

# Start Next.js dev server
dev:
	@echo "🚀 Starting Next.js dev server..."
	npm run dev

# First-time setup
setup:
	@echo "⚙️  First-time setup..."
	@echo "1️⃣  Installing dependencies..."
	npm install --legacy-peer-deps
	@echo "2️⃣  Starting containers..."
	make db-up
	@echo "3️⃣  Running migrations..."
	npx prisma migrate dev --name init
	@echo "4️⃣  Generating Prisma Client..."
	npx prisma generate
	@echo "5️⃣  Seeding database..."
	npx prisma db seed
	@echo ""
	@echo "✅ Setup complete! Run 'make dev' to start development"

# Run tests
test:
	@echo "🧪 Running tests..."
	npm test

# Lint code
lint:
	@echo "🔍 Linting code..."
	npm run lint

# Build for production
build:
	@echo "🏗️  Building for production..."
	npm run build

# Generate Prisma Client
generate:
	@echo "🔧 Generating Prisma Client..."
	npx prisma generate

# View logs
logs:
	docker-compose logs -f postgres redis

# Database backup
db-backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker-compose exec -T postgres pg_dump -U microlytics microlytics_dev > backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "✅ Backup created in backups/"

# Database restore (usage: make db-restore FILE=backups/backup-xxx.sql)
db-restore:
	@if [ -z "$(FILE)" ]; then \
		echo "❌ Error: Please specify FILE=path/to/backup.sql"; \
		exit 1; \
	fi
	@echo "📥 Restoring database from $(FILE)..."
	docker-compose exec -T postgres psql -U microlytics -d microlytics_dev < $(FILE)
	@echo "✅ Database restored!"

# Clean everything (containers, volumes, node_modules)
clean:
	@echo "🧹 Cleaning everything..."
	docker-compose down -v
	rm -rf node_modules .next
	@echo "✅ Clean complete!"

