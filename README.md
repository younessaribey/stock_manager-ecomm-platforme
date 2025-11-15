# Stock Manager - Full Stack E-Commerce Platform

My e-commerce platform built with modern technologies. This project started as a learning exercise and evolved into a production-ready system that I'm using to demonstrate my skills in backend development, microservices, and cloud deployment.

## What This Project Does

This is a complete stock management and e-commerce system where:
- Users can browse products, add them to cart, and place orders
- Admins can manage inventory, process orders, and view analytics
- The system uses message queues for background jobs like sending order confirmations
- Redis caching speeds up product listings and reduces database load
- Everything runs in Docker containers for easy deployment

---

## Tech Stack

### Backend (NestJS)
- **NestJS** - TypeScript framework for building scalable server-side applications
- **PostgreSQL** - Relational database for storing products, orders, users
- **TypeORM** - Database ORM for type-safe database operations
- **RabbitMQ** - Message broker for async tasks (order processing, notifications)
- **Redis** - In-memory cache for frequently accessed data
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Frontend (React)
- **React** - UI library
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **DigitalOcean** - Cloud hosting (droplet running Ubuntu 22.04)
- **Nginx** - Reverse proxy (optional)

---

## Project Structure

```
stock_manager-ecomm-platforme/
├── nestjs-backend/          # NestJS backend API
│   ├── src/
│   │   ├── auth/           # Authentication (login, register, JWT)
│   │   ├── users/          # User management
│   │   ├── products/       # Product CRUD operations
│   │   ├── categories/     # Product categories
│   │   ├── orders/         # Order processing
│   │   ├── cart/           # Shopping cart
│   │   ├── wishlist/       # User wishlist
│   │   ├── settings/       # App settings (key-value store)
│   │   ├── news/           # News/blog posts
│   │   ├── images/         # Image upload management
│   │   ├── dashboard/      # Admin analytics
│   │   ├── rabbitmq/       # Message queue service
│   │   ├── redis/          # Cache service
│   │   ├── common/         # Shared utilities (filters, interceptors, guards)
│   │   └── config/         # Configuration files
│   ├── Dockerfile
│   └── package.json
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── utils/
│   └── package.json
├── docker-compose.yml       # Development setup
├── docker-compose.prod.yml  # Production setup
└── README.md

```

---

## Key Features I Built

### 1. Authentication & Authorization
- JWT-based auth with refresh tokens
- Role-based access control (Admin vs User)
- Password hashing with bcrypt
- Protected routes using guards

### 2. Product Management
- Full CRUD operations for products
- Category system
- Image upload support
- Stock tracking with low-stock alerts
- Product conditions (new, used, refurbished)

### 3. Order System
- Shopping cart functionality
- Order creation with transaction support
- Order status tracking (pending → processing → completed)
- Order history for users

### 4. Performance Optimization
- Redis caching for product listings
- Database query optimization
- Rate limiting to prevent abuse
- Global error handling and logging

### 5. Microservices Architecture
- RabbitMQ for async job processing
- Separate services for different concerns
- Event-driven communication

### 6. Admin Dashboard
- Real-time stats (products, orders, revenue)
- User management
- Low stock alerts
- Order processing

---

## Local Development Setup

### Prerequisites
```bash
# You need:
- Node.js 18+ and npm
- Docker and Docker Compose
```

### Quick Start

1. **Clone the repo**
```bash
git clone <your-repo-url>
cd stock_manager-ecomm-platforme
```

2. **Set up environment variables**
```bash
cd nestjs-backend
cp .env.example .env
# Edit .env with your settings
```

3. **Start all services with Docker**
```bash
# From project root
docker compose up -d

# This starts:
# - PostgreSQL on port 5432
# - RabbitMQ on port 5672 (management UI on 15672)
# - Redis on port 6379
# - NestJS API on port 3000
```

4. **Check if everything is running**
```bash
docker compose ps

# Test the API
curl http://localhost:3000/api/health
```

5. **View logs**
```bash
docker compose logs -f api
```

### Development Without Docker

```bash
# Install dependencies
cd nestjs-backend
npm install

# Start PostgreSQL, RabbitMQ, Redis locally or use cloud services
# Update .env with connection strings

# Run in development mode
npm run start:dev

# The API will be available at http://localhost:3000/api
```

---

## API Endpoints

### Public Endpoints
```
GET  /api/health              # Health check
GET  /api/products/public     # List all products
GET  /api/categories          # List categories
GET  /api/news                # List news articles
```

### Authentication
```
POST /api/auth/register       # Register new user
POST /api/auth/login          # Login (returns JWT token)
GET  /api/auth/me             # Get current user info
```

### Products (Admin only)
```
POST   /api/products          # Create product
PUT    /api/products/:id      # Update product
DELETE /api/products/:id      # Delete product
```

### Orders (Authenticated users)
```
GET  /api/orders              # Get my orders
POST /api/orders              # Create new order
GET  /api/orders/:id          # Get order details
```

### Cart (Authenticated users)
```
GET    /api/cart              # Get my cart
POST   /api/cart              # Add item to cart
PUT    /api/cart/:id          # Update cart item quantity
DELETE /api/cart/:id          # Remove item from cart
```

### Admin Dashboard
```
GET /api/dashboard/stats      # Get admin analytics
```

---

## Deployment to DigitalOcean

### My Current Setup
- **Droplet**: Ubuntu 22.04 LTS
- **Size**: 1 vCPU, 1GB RAM ($6/month)
- **Region**: Amsterdam (AMS3)
- **IP**: 146.190.16.6

### Deployment Steps

1. **SSH into your droplet**
```bash
ssh root@146.190.16.6
```

2. **Install Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker
```

3. **Install Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

4. **Clone your project**
```bash
git clone <your-repo-url>
cd stock_manager-ecomm-platforme
```

5. **Set up environment variables**
```bash
cd nestjs-backend
nano .env

# Add your production values:
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<strong-password>
DB_NAME=stmg
RABBITMQ_URL=amqp://admin:<strong-password>@rabbitmq:5672
REDIS_PASSWORD=<strong-password>
JWT_SECRET=<your-secret-key>
```

6. **Start the application**
```bash
cd ..
docker compose -f docker-compose.prod.yml up -d
```

7. **Configure firewall**
```bash
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw allow 3000    # API (or use Nginx)
sudo ufw enable
```

8. **Check everything is running**
```bash
docker compose -f docker-compose.prod.yml ps
curl http://146.190.16.6:3000/api/health
```

### SSL Setup (Optional but Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

---

## What I Learned Building This

1. **NestJS Architecture** - How to structure a scalable backend with modules, services, controllers, and DTOs

2. **Microservices Communication** - Using RabbitMQ for async tasks instead of blocking the main request

3. **Caching Strategy** - Implementing cache-aside pattern with Redis to reduce database load

4. **TypeScript Best Practices** - Strong typing, decorators, interfaces, and generics

5. **Docker & Containerization** - Multi-stage builds, docker-compose orchestration, health checks

6. **Database Design** - Relational database modeling with TypeORM, migrations, and relationships

7. **Security** - JWT authentication, password hashing, rate limiting, CORS configuration

8. **Error Handling** - Global exception filters, custom error responses, logging

9. **Cloud Deployment** - Setting up and managing a DigitalOcean droplet, SSH access, firewalls

10. **Git & Version Control** - Feature branches, commits, and deployment workflows

---

## Environment Variables

Create a `.env` file in `nestjs-backend/`:

```env
# Server
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=stmg

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@localhost:5672

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis123
```

---

## Common Commands

```bash
# Development
npm run start:dev          # Start in watch mode
npm run build              # Build for production
npm run lint               # Run ESLint
npm run format             # Format with Prettier

# Docker
docker compose up -d                        # Start all services
docker compose down                         # Stop all services
docker compose logs -f api                  # View API logs
docker compose restart api                  # Restart API service
docker compose -f docker-compose.prod.yml up -d  # Production

# Database
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
npm run typeorm migration:revert
```

---

## Troubleshooting

### API won't start
```bash
# Check logs
docker compose logs api

# Common issues:
# 1. Database not ready - wait a few seconds
# 2. Port 3000 already in use - change PORT in .env
# 3. Missing .env file - copy from .env.example
```

### Can't connect to database
```bash
# Check if PostgreSQL is running
docker compose ps

# Check database logs
docker compose logs postgres

# Test connection
docker compose exec postgres psql -U postgres -d stmg
```

### RabbitMQ not working
```bash
# Access management UI: http://localhost:15672
# Default credentials: admin/admin123

# Check RabbitMQ logs
docker compose logs rabbitmq
```

---

## Future Improvements

Things I plan to add:
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications using RabbitMQ
- [ ] Product reviews and ratings
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications with WebSockets
- [ ] Mobile app with React Native
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Monitoring with Prometheus & Grafana
- [ ] Load balancing with multiple API instances
- [ ] S3 integration for image storage

---

## License

MIT

---

## Contact

Feel free to reach out if you have questions about this project. I built this to learn and demonstrate my skills in:
- Backend development with NestJS
- Microservices architecture
- Docker containerization
- Cloud deployment
- Full-stack development

I'm actively looking for opportunities where I can apply these skills!
