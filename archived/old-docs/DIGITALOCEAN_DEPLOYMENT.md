# DigitalOcean Deployment Guide

Complete guide for deploying Stock Manager to DigitalOcean using Docker, NestJS, PostgreSQL, and RabbitMQ.

## Architecture

- **Backend**: NestJS API (Docker container)
- **Database**: PostgreSQL 15 (Docker container)
- **Message Queue**: RabbitMQ (Docker container)
- **Reverse Proxy**: Nginx (optional, for production)
- **Frontend**: React build served via Nginx or separate service

## Prerequisites

1. DigitalOcean account
2. Droplet created (Ubuntu 22.04 LTS recommended)
3. SSH access to droplet
4. Domain name (optional, for production)

## Step 1: Set Up DigitalOcean Droplet

### Create Droplet

1. Go to DigitalOcean → Create → Droplets
2. Choose:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic (2GB RAM minimum recommended)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH keys (recommended) or password
3. Click "Create Droplet"

### Initial Server Setup

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Add your user to docker group (if not root)
usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

## Step 2: Clone and Configure Project

```bash
# Clone your repository
git clone https://github.com/your-username/stock_manager-ecomm-platforme.git
cd stock_manager-ecomm-platforme

# Create production environment file
cp .env.example .env.production
nano .env.production
```

### Environment Variables (.env.production)

```env
# Server
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-secure-password-here
DB_NAME=stmg

# RabbitMQ
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=your-secure-rabbitmq-password
RABBITMQ_VHOST=/
RABBITMQ_URL=amqp://admin:your-secure-rabbitmq-password@rabbitmq:5672/

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# Ports (for docker-compose)
API_PORT=3000
DB_PORT=5432
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443
```

## Step 3: Build and Start Services

```bash
# Build NestJS application
cd nestjs-backend
npm install
npm run build
cd ..

# Start all services with Docker Compose
docker compose -f docker-compose.prod.yml up -d --build

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f api
```

## Step 4: Initialize Database

The database will automatically create tables on first startup via TypeORM `synchronize: true` (in development mode).

For production, you should use migrations:

```bash
# Generate migration
cd nestjs-backend
npm run migration:generate -- -n InitialSchema

# Run migrations
npm run migration:run
```

## Step 5: Configure Nginx (Optional but Recommended)

### Create Nginx Configuration

```bash
mkdir -p nginx/ssl
nano nginx/nginx.conf
```

### Nginx Config (nginx/nginx.conf)

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # API endpoints
        location /api {
            proxy_pass http://api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Frontend static files
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate (if using domain)
certbot --nginx -d your-domain.com -d www.your-domain.com

# Certificates will be auto-renewed
```

## Step 6: Deploy Frontend

```bash
# Build React app
cd client
npm install
npm run build

# Copy build to nginx volume
cp -r build/* ../nginx/html/
```

Or add frontend to docker-compose:

```yaml
frontend:
  build:
    context: ./client
    dockerfile: Dockerfile
  volumes:
    - ./client/build:/usr/share/nginx/html:ro
```

## Step 7: Set Up Firewall

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

## Step 8: Monitoring and Maintenance

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f postgres
docker compose -f docker-compose.prod.yml logs -f rabbitmq
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart api
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build api
```

### Backup Database

```bash
# Create backup
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres stmg > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres stmg < backup_20231201_120000.sql
```

## Step 9: Access Services

- **API**: `http://your-droplet-ip:3000/api` or `https://your-domain.com/api`
- **RabbitMQ Management**: `http://your-droplet-ip:15672` (admin/admin123)
- **Health Check**: `http://your-droplet-ip:3000/api/health`

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs api

# Check container status
docker compose -f docker-compose.prod.yml ps

# Restart container
docker compose -f docker-compose.prod.yml restart api
```

### Database Connection Issues

```bash
# Test database connection
docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -d stmg

# Check database logs
docker compose -f docker-compose.prod.yml logs postgres
```

### RabbitMQ Connection Issues

```bash
# Check RabbitMQ status
docker compose -f docker-compose.prod.yml exec rabbitmq rabbitmq-diagnostics status

# Access management UI
# http://your-droplet-ip:15672 (admin/admin123)
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.prod.yml
```

## Production Checklist

- [ ] Change all default passwords
- [ ] Set up SSL certificates
- [ ] Configure firewall
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Set up monitoring (optional: DigitalOcean Monitoring)
- [ ] Enable database migrations (disable synchronize)
- [ ] Set up CI/CD pipeline
- [ ] Configure domain DNS
- [ ] Test all endpoints
- [ ] Set up error tracking (Sentry, etc.)

## Cost Optimization

- Use smallest droplet that meets requirements (2GB RAM minimum)
- Enable DigitalOcean monitoring (free)
- Set up automated snapshots
- Use object storage for file uploads (Spaces)
- Enable CDN for static assets

## Next Steps

1. Set up CI/CD with GitHub Actions
2. Configure automated backups
3. Set up monitoring and alerts
4. Optimize database queries
5. Implement caching (Redis)

