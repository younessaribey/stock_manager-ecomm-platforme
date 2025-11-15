# 🚀 DigitalOcean Deployment Checklist

## ✅ Pre-Deployment Checks

### Code Quality
- [x] ESLint warnings fixed
- [x] TypeScript types properly defined
- [x] No unused imports
- [x] Proper error handling
- [x] Code formatted with Prettier

### Docker Setup
- [x] Dockerfile created
- [x] docker-compose.prod.yml configured
- [x] Environment variables set
- [x] Health checks configured
- [x] Volumes configured

### Database
- [x] PostgreSQL configured
- [x] TypeORM entities created
- [x] Migrations ready
- [x] Connection pooling configured

### Services
- [x] Redis configured
- [x] RabbitMQ configured
- [x] All services connected

---

## 📋 Deployment Steps

### 1. DigitalOcean Droplet Setup

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 2. Clone Repository

```bash
# Clone your repo
git clone https://github.com/your-username/stock_manager-ecomm-platforme.git
cd stock_manager-ecomm-platforme
```

### 3. Configure Environment

```bash
# Copy environment template
cp nestjs-backend/.env.example nestjs-backend/.env

# Edit with production values
nano nestjs-backend/.env
```

**Required Environment Variables:**
```env
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=stmg
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
RABBITMQ_URL=amqp://admin:your_password@rabbitmq:5672/
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
CLIENT_URL=https://your-domain.com
```

### 4. Build and Start Services

```bash
# Build NestJS application
cd nestjs-backend
npm install
npm run build
cd ..

# Start all services
docker compose -f docker-compose.prod.yml up -d --build

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f api
```

### 5. Initialize Database

The database will auto-create tables on first startup. Verify:

```bash
# Connect to PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -d stmg

# Check tables
\dt

# Should see: users, products, categories, orders, etc.
\q
```

### 6. Configure Nginx (Optional)

```bash
# Install Nginx
apt install nginx -y

# Create Nginx config
nano /etc/nginx/sites-available/stock-manager
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/stock-manager /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 7. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 8. Firewall Configuration

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
ufw status
```

---

## 🔍 Verification

### Test API Health

```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Endpoints

```bash
# Public endpoint
curl http://localhost:3000/api/products/public

# Protected endpoint (requires JWT)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/products
```

### Check Services

```bash
# PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres pg_isready

# Redis
docker compose -f docker-compose.prod.yml exec redis redis-cli ping
# Should return: PONG

# RabbitMQ
docker compose -f docker-compose.prod.yml exec rabbitmq rabbitmq-diagnostics status
```

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f postgres
docker compose -f docker-compose.prod.yml logs -f redis
```

### Check Resource Usage

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

---

## 🔄 Updates

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
cd nestjs-backend
npm install
npm run build
cd ..
docker compose -f docker-compose.prod.yml up -d --build api
```

### Database Backup

```bash
# Create backup
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres stmg > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres stmg < backup_20231201_120000.sql
```

---

## ⚠️ Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs api

# Check container status
docker compose -f docker-compose.prod.yml ps

# Restart service
docker compose -f docker-compose.prod.yml restart api
```

### Database Connection Issues

```bash
# Test connection
docker compose -f docker-compose.prod.yml exec api node -e "console.log(process.env.DB_HOST)"

# Check database logs
docker compose -f docker-compose.prod.yml logs postgres
```

### Redis Connection Issues

```bash
# Test Redis
docker compose -f docker-compose.prod.yml exec redis redis-cli ping

# Check Redis logs
docker compose -f docker-compose.prod.yml logs redis
```

---

## ✅ Deployment Complete!

Your NestJS application is now deployed on DigitalOcean with:
- ✅ PostgreSQL database
- ✅ Redis caching
- ✅ RabbitMQ messaging
- ✅ Docker containerization
- ✅ Production-ready configuration

🎉 **Congratulations!**

