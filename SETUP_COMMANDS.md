# 🚀 STEP-BY-STEP SETUP GUIDE - Run These Commands

## ✅ Quick Status Check
- ✅ Docker is installed
- ✅ RabbitMQ & Redis are running
- ⚠️ PostgreSQL container failed (port conflict fixed, needs restart)

---

## 📝 STEP 1: Start Docker Containers

```bash
# Navigate to project
cd /Users/mac/Desktop/stock_manager-ecomm-platforme

# Stop any existing containers
docker compose down

# Start all containers (PostgreSQL, Redis, RabbitMQ, NestJS API)
docker compose up -d

# Wait 30 seconds, then check status
docker compose ps

# Expected: All should show "Up (healthy)"
```

**What this does:**
- Starts PostgreSQL on port 5434 (avoids conflict with Mac PostgreSQL on 5432/5433)
- Starts Redis on port 6379
- Starts RabbitMQ on ports 5672 (AMQP) and 15672 (Web UI)
- Builds and starts NestJS API on port 3000

---

## 📝 STEP 2: Test API Health

```bash
# Test if NestJS API is running
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

**If it fails:**
- Wait 60 seconds (API needs time to start)
- Check logs: `docker compose logs api -f`
- Press Ctrl+C to stop logs

---

## 📝 STEP 3: Install NestJS Dependencies (if needed)

```bash
# Navigate to backend
cd /Users/mac/Desktop/stock_manager-ecomm-platforme/nestjs-backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Verify build succeeded
ls dist/ | head -5
```

---

## 📝 STEP 4: Run Tests

```bash
# Stay in nestjs-backend folder
cd /Users/mac/Desktop/stock_manager-ecomm-platforme/nestjs-backend

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

**Expected:** Tests should pass ✅

---

## 📝 STEP 5: Test Authentication Flow

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'

# Login (save the token from response!)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# Copy the "token" from response, then test protected route:
# Replace YOUR_TOKEN_HERE with the actual token
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 STEP 6: Check Database Connection

```bash
# Connect to Docker PostgreSQL
docker compose exec postgres psql -U postgres -d stmg

# Inside PostgreSQL:
\dt              # List all tables
SELECT * FROM users;  # See users
\q               # Exit PostgreSQL
```

---

## 📝 STEP 7: Check Redis

```bash
# Test Redis connection
docker compose exec redis redis-cli ping

# Expected: PONG
```

---

## 📝 STEP 8: Check RabbitMQ Management

```bash
# Open in browser (or check it works)
open http://localhost:15672

# Login:
# Username: admin
# Password: admin123
```

---

## 📝 STEP 9: Commit Your Changes

```bash
# Go back to project root
cd /Users/mac/Desktop/stock_manager-ecomm-platforme

# Check what changed
git status

# Add changes
git add docker-compose.yml

# Commit
git commit -m "fix: change PostgreSQL port to 5434 to avoid conflict with Mac PostgreSQL"

# Push to GitHub
git push origin main
```

---

## 📝 STEP 10: Verify Everything Works

```bash
# Final checklist - run all these:

# 1. Docker containers running?
docker compose ps
# ✅ All should be "Up (healthy)"

# 2. API responding?
curl http://localhost:3000/api/health
# ✅ Should return {"status":"ok",...}

# 3. Tests passing?
cd nestjs-backend && npm test
# ✅ Should pass

# 4. Can register user?
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"test123","name":"Test"}'
# ✅ Should create user

# 5. Can login?
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"test123"}'
# ✅ Should return token
```

---

## 🐛 TROUBLESHOOTING COMMANDS

### If PostgreSQL fails to start:
```bash
# Check if Mac PostgreSQL is using port 5432
lsof -i :5432

# If yes, stop it (if you want to use Docker PostgreSQL instead):
brew services stop postgresql@15

# Or keep using port 5434 for Docker (recommended)
```

### If API won't start:
```bash
# View API logs
docker compose logs api -f

# Rebuild API container
docker compose up -d --build api

# Check if database is ready
docker compose exec postgres pg_isready -U postgres
```

### If tests fail:
```bash
# Make sure dependencies are installed
cd nestjs-backend
npm install

# Clear test cache
rm -rf node_modules/.cache

# Run tests again
npm test
```

### If Docker containers stop:
```bash
# Restart everything
docker compose restart

# Or start fresh
docker compose down
docker compose up -d
```

---

## 📊 USEFUL COMMANDS REFERENCE

```bash
# Docker Management
docker compose up -d              # Start all services
docker compose down               # Stop all services
docker compose ps                 # Check status
docker compose logs api -f        # View API logs
docker compose restart api        # Restart API service
docker compose exec postgres psql -U postgres -d stmg  # Access PostgreSQL

# Testing
cd nestjs-backend
npm test                          # Run unit tests
npm run test:e2e                  # Run E2E tests
npm run test:cov                  # Coverage report

# API Testing
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products/public

# Database
docker compose exec postgres psql -U postgres -d stmg
docker compose exec redis redis-cli ping

# RabbitMQ
open http://localhost:15672  # Management UI
# Login: admin / admin123
```

---

## ✅ SUCCESS CHECKLIST

After running all steps, you should have:

- [ ] All Docker containers running and healthy
- [ ] NestJS API responding on http://localhost:3000
- [ ] All tests passing
- [ ] Can register new users
- [ ] Can login and get JWT token
- [ ] Can access protected routes with token
- [ ] PostgreSQL database accessible
- [ ] Redis responding
- [ ] RabbitMQ management UI accessible
- [ ] Code committed and pushed to GitHub

---

## 🎯 NEXT STEPS (After Setup Works)

1. **Test locally** - Make sure everything works
2. **Review documentation** - Read README.md and docs
3. **Practice for interview** - Review INTERVIEW_PREP.md (local, not on GitHub)
4. **Deploy to DigitalOcean** - When ready, follow deployment guide

---

## 💡 TIP: Create an Alias for Easy Access

Add this to your `~/.zshrc`:

```bash
# Docker shortcuts
alias dcu='docker compose up -d'
alias dcd='docker compose down'
alias dcp='docker compose ps'
alias dcl='docker compose logs -f'

# Project shortcuts
alias stock='cd /Users/mac/Desktop/stock_manager-ecomm-platforme'
alias stock-api='cd /Users/mac/Desktop/stock_manager-ecomm-platforme/nestjs-backend'
```

Then reload: `source ~/.zshrc`

Now you can just type: `stock && dcu` to start everything!

---

**Run these commands one by one, and you'll have everything set up!** 🚀

