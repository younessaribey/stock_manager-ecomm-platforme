# Step-by-Step DigitalOcean Deployment Guide

This guide will walk you through deploying the NestJS application to your DigitalOcean droplet.

---

## Your Droplet Info

- **IP**: 146.190.16.6
- **OS**: Ubuntu 22.04 LTS
- **Size**: 1 vCPU, 1GB RAM
- **Region**: Amsterdam (AMS3)
- **Private IP**: 10.110.0.2

---

## Step 1: Connect to Your Droplet

```bash
# If you set up SSH keys during droplet creation:
ssh root@146.190.16.6

# If you're using password:
# (DigitalOcean sent you the password via email)
ssh root@146.190.16.6
# Enter password when prompted
```

**First time?** You'll be asked to change the root password.

---

## Step 2: Update System Packages

```bash
# Update package lists
apt update

# Upgrade installed packages
apt upgrade -y

# Install basic utilities
apt install -y curl git vim ufw
```

**Why?** Keep your system secure and up-to-date.

---

## Step 3: Install Docker

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installation
sh get-docker.sh

# Enable Docker to start on boot
systemctl enable docker

# Start Docker service
systemctl start docker

# Verify Docker is running
docker --version
docker ps
```

**Expected output**: `Docker version 24.x.x`

---

## Step 4: Install Docker Compose

```bash
# Download latest Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

**Expected output**: `Docker Compose version v2.x.x`

---

## Step 5: Clone Your Project

```bash
# Navigate to home directory
cd /root

# Clone your repository
git clone <your-git-repo-url> stock-manager
cd stock-manager

# Or if you don't have a repo yet, copy files manually:
# On your local machine:
# scp -r /path/to/project root@146.190.16.6:/root/stock-manager
```

---

## Step 6: Set Up Environment Variables

```bash
# Navigate to backend directory
cd nestjs-backend

# Create .env file
nano .env
```

**Copy and paste this, then edit the values:**

```env
# Server Configuration
NODE_ENV=production
PORT=3000
CLIENT_URL=http://146.190.16.6:3000

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YourStrongPasswordHere123!
DB_NAME=stmg

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d

# RabbitMQ Configuration
RABBITMQ_URL=amqp://admin:RabbitMQPassword123!@rabbitmq:5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=RabbitMQPassword123!
RABBITMQ_VHOST=/
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=RedisPassword123!

# API Configuration
API_PORT=3000
```

**Save and exit**: Press `Ctrl + O`, `Enter`, then `Ctrl + X`

**⚠️ IMPORTANT**: Change ALL passwords! Don't use the examples above.

---

## Step 7: Configure Firewall

```bash
# Allow SSH (IMPORTANT: Don't lock yourself out!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Allow API port
ufw allow 3000/tcp

# (Optional) Allow RabbitMQ Management UI
ufw allow 15672/tcp

# Enable firewall
ufw enable

# Check firewall status
ufw status
```

**Expected output**:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
3000/tcp                   ALLOW       Anywhere
```

---

## Step 8: Build and Start the Application

```bash
# Navigate to project root
cd /root/stock-manager

# Build images (first time only)
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# This starts:
# - PostgreSQL
# - RabbitMQ
# - Redis
# - NestJS API
```

**What `-d` means**: Run in detached mode (background)

---

## Step 9: Verify Everything is Running

```bash
# Check all containers
docker-compose -f docker-compose.prod.yml ps

# You should see:
# stock-manager-postgres   Up (healthy)
# stock-manager-rabbitmq   Up (healthy)
# stock-manager-redis      Up (healthy)
# stock-manager-api        Up (healthy)
```

### Check Individual Services

```bash
# View API logs
docker-compose -f docker-compose.prod.yml logs -f api

# Press Ctrl+C to exit logs

# Test API health
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-..."}

# Test from your computer:
curl http://146.190.16.6:3000/api/health
```

---

## Step 10: Access Services

### API Endpoints
```
http://146.190.16.6:3000/api/health
http://146.190.16.6:3000/api/products/public
http://146.190.16.6:3000/api/categories
```

### RabbitMQ Management UI
```
http://146.190.16.6:15672
Username: admin
Password: (what you set in .env)
```

### PostgreSQL (from inside droplet)
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d stmg
```

---

## Step 11: (Optional) Set Up Domain and SSL

### If you have a domain (e.g., api.yourdomain.com):

1. **Point domain to your droplet IP**:
   - Go to your domain registrar
   - Add an A record: `api` → `146.190.16.6`
   - Wait 5-10 minutes for DNS propagation

2. **Install Nginx**:
```bash
apt install -y nginx
```

3. **Configure Nginx**:
```bash
nano /etc/nginx/sites-available/stock-manager
```

**Paste this configuration**:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

4. **Enable the site**:
```bash
ln -s /etc/nginx/sites-available/stock-manager /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

5. **Install SSL certificate**:
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d api.yourdomain.com

# Follow the prompts, enter your email
# Choose option 2 (Redirect HTTP to HTTPS)
```

**Now your API is available at**: `https://api.yourdomain.com`

---

## Step 12: Create Initial Admin User

```bash
# Access the API container
docker-compose -f docker-compose.prod.yml exec api sh

# Inside the container, use curl or create a script
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123!",
    "name": "Admin User",
    "role": "admin"
  }'

# Exit container
exit
```

**Or use Postman/Insomnia from your computer:**
```
POST http://146.190.16.6:3000/api/auth/register
Body:
{
  "email": "admin@example.com",
  "password": "AdminPassword123!",
  "name": "Admin User",
  "role": "admin"
}
```

---

## Common Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs postgres

# Follow logs (live)
docker-compose -f docker-compose.prod.yml logs -f api
```

### Restart Services
```bash
# Restart specific service
docker-compose -f docker-compose.prod.yml restart api

# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Start all services
docker-compose -f docker-compose.prod.yml up -d
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
cd /root/stock-manager
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Check Resource Usage
```bash
# Docker stats
docker stats

# System resources
htop  # (install with: apt install htop)
free -h  # Memory
df -h  # Disk space
```

### Database Backup
```bash
# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres stmg > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres stmg < backup_20240315.sql
```

---

## Troubleshooting

### Issue: API container keeps restarting

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs api

# Common causes:
# 1. Database not ready - wait 30 seconds and check again
# 2. Wrong DB credentials - check .env file
# 3. Port already in use - check: netstat -tulpn | grep 3000
```

### Issue: Can't connect from outside

```bash
# Check if API is listening
curl http://localhost:3000/api/health

# If works locally but not externally:
# 1. Check firewall: ufw status
# 2. Check if port is open: netstat -tulpn | grep 3000
# 3. Check DigitalOcean firewall settings in dashboard
```

### Issue: Out of memory

```bash
# Check memory usage
free -h

# With 1GB RAM, you might need to add swap:
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Issue: Database connection errors

```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Connect to database manually
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d stmg

# List tables
\dt

# Exit
\q
```

---

## Security Checklist

- [ ] Changed all default passwords
- [ ] Set strong JWT_SECRET (minimum 32 characters)
- [ ] Enabled UFW firewall
- [ ] Only opened necessary ports
- [ ] Set up SSH key authentication
- [ ] Disabled root SSH login (optional but recommended)
- [ ] Installed SSL certificate
- [ ] Set up automatic security updates
- [ ] Created non-root user (recommended)
- [ ] Set up log rotation

---

## Monitoring (Optional)

### Set up automatic restarts:
```bash
# Edit docker-compose.prod.yml, add to each service:
restart: unless-stopped

# Or start with --restart flag
```

### Set up log rotation:
```bash
nano /etc/docker/daemon.json

# Add:
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Restart Docker
systemctl restart docker
```

---

## Performance Tips for 1GB RAM

1. **Limit Docker memory**:
   Edit `docker-compose.prod.yml` and add to services:
   ```yaml
   mem_limit: 256m
   ```

2. **Optimize PostgreSQL**:
   ```bash
   # Add to postgres environment in docker-compose.prod.yml:
   - POSTGRES_SHARED_BUFFERS=128MB
   - POSTGRES_EFFECTIVE_CACHE_SIZE=256MB
   ```

3. **Enable Redis memory limits**:
   ```bash
   # Add to redis command in docker-compose.prod.yml:
   command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
   ```

---

## Next Steps After Deployment

1. **Test all endpoints** with Postman/Insomnia
2. **Create test data** (products, categories, etc.)
3. **Monitor logs** for errors
4. **Set up backups** (database, files)
5. **Document API** for frontend team
6. **Set up monitoring** (optional: UptimeRobot, Datadog)
7. **Configure CI/CD** (optional: GitHub Actions)

---

## Quick Test Checklist

After deployment, test these endpoints:

```bash
# Health check
curl http://146.190.16.6:3000/api/health

# Register user
curl -X POST http://146.190.16.6:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://146.190.16.6:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get products (public)
curl http://146.190.16.6:3000/api/products/public

# Get categories (public)
curl http://146.190.16.6:3000/api/categories
```

---

## Support

If you run into issues:

1. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verify all containers are healthy: `docker-compose -f docker-compose.prod.yml ps`
3. Check firewall: `ufw status`
4. Test locally first: `curl http://localhost:3000/api/health`
5. Review environment variables: `cat nestjs-backend/.env`

---

## Congratulations! 🎉

Your NestJS application is now deployed on DigitalOcean!

**Your API is available at**: `http://146.190.16.6:3000/api`

**Next**: Connect your frontend, test everything, and show it off in your interview!

