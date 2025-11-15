# 🐳 Docker Installation Guide for Mac

## What is Docker?

**Docker** is a platform that runs your application and all its dependencies in isolated "containers". Think of containers as lightweight virtual machines that:
- Package your app with all its dependencies
- Run consistently on any machine (your Mac, DigitalOcean, etc.)
- Make development and deployment easier

## Why You Need Docker for This Project

Your NestJS backend uses **4 Docker containers**:

1. **PostgreSQL** - Database that stores users, products, orders
2. **Redis** - Cache for speeding up responses
3. **RabbitMQ** - Message queue for async order processing  
4. **NestJS API** - Your backend application

Without Docker, you'd have to:
- Install PostgreSQL manually
- Install Redis manually
- Install RabbitMQ manually
- Configure everything separately

With Docker, one command starts everything! 🚀

---

## 📥 Installation Steps

### **Option 1: Install via Homebrew (Easiest)** ⭐ RECOMMENDED

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker

# Start Docker Desktop
open -a Docker

# Wait for Docker to start (30-60 seconds), then verify:
docker --version
docker compose version
```

### **Option 2: Download Docker Desktop Directly**

1. **Go to**: https://www.docker.com/products/docker-desktop/
2. **Download** Docker Desktop for Mac
3. **Open** the `.dmg` file
4. **Drag** Docker to Applications folder
5. **Launch** Docker from Applications
6. **Wait** for Docker to start (whale icon in menu bar should stop animating)

---

## ✅ Verification

After installation, verify Docker is working:

```bash
# Check Docker version
docker --version
# Expected: Docker version 24.x.x or higher

# Check Docker Compose version  
docker compose version
# Expected: Docker Compose version v2.x.x or higher

# Test Docker is running
docker ps
# Expected: Empty list (no containers yet) - this is OK!
```

---

## 🚀 After Installation - Start Your Project

Once Docker is installed and running:

```bash
# Navigate to your project
cd /Users/mac/Desktop/stock_manager-ecomm-platforme

# Start all services (PostgreSQL, Redis, RabbitMQ, NestJS API)
docker compose up -d

# Wait 30 seconds for health checks, then check status:
docker compose ps

# All should show "Up (healthy)"
```

---

## 🔧 Troubleshooting

### **Problem: "Docker is not running"**
**Solution**: 
- Click Docker icon in menu bar
- Select "Start Docker Desktop"
- Wait for whale icon to stop animating

### **Problem: "Cannot connect to Docker daemon"**
**Solution**:
```bash
# Restart Docker Desktop
open -a Docker

# Wait 60 seconds, then try again
docker ps
```

### **Problem: "docker compose" not found**
**Solution**: Use `docker-compose` (older version) or install Docker Desktop which includes it

---

## 💡 Why Docker is Important for Your Interview

When they ask: *"How do you handle local development?"*

**Your Answer**:
*"I use Docker Compose to run all my services locally - PostgreSQL, Redis, RabbitMQ, and my NestJS API. One command starts everything, and it matches my production environment exactly. This ensures consistency between development and production, and makes onboarding new developers easy - they just run `docker compose up`."*

This shows:
- ✅ DevOps knowledge
- ✅ Understanding of containerization
- ✅ Professional development practices
- ✅ Production-ready mindset

---

## 📚 Quick Reference

### **Common Docker Commands**

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View running containers
docker compose ps

# View logs
docker compose logs api -f

# Restart a service
docker compose restart api

# Rebuild after code changes
docker compose up -d --build
```

---

## ✨ Next Steps

1. **Install Docker Desktop** (use Option 1 or 2 above)
2. **Start Docker Desktop** (from Applications)
3. **Wait** for Docker to fully start (whale icon in menu bar)
4. **Run**: `docker compose up -d`
5. **Verify**: `docker compose ps` (all should be "Up (healthy)")

---

**Once Docker is installed, you'll be able to test everything locally!** 🎉

