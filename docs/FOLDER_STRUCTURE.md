# Project Folder Structure

Clean, organized directory structure for the Stock Manager project.

---

## Current Structure

```
stock_manager-ecomm-platforme/
│
├── .github/                        # GitHub Actions CI/CD
│   └── workflows/
│       ├── ci.yml                 # Automated testing
│       └── deploy.yml             # Automated deployment
│
├── nestjs-backend/                # Main NestJS Backend
│   ├── src/
│   │   ├── auth/                  # Authentication module
│   │   ├── users/                 # User management
│   │   ├── products/              # Product CRUD
│   │   ├── categories/            # Categories
│   │   ├── orders/                # Order processing
│   │   ├── cart/                  # Shopping cart
│   │   ├── wishlist/              # User wishlist
│   │   ├── settings/              # App settings
│   │   ├── images/                # Image uploads
│   │   ├── news/                  # News/blog
│   │   ├── dashboard/             # Admin dashboard
│   │   ├── rabbitmq/              # Message queue
│   │   ├── redis/                 # Cache service
│   │   ├── common/                # Shared utilities
│   │   └── config/                # Configuration
│   ├── Dockerfile
│   └── package.json
│
├── client/                        # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── utils/
│   └── package.json
│
├── docs/                          # Documentation
│   ├── COMMIT_GUIDE.md           # Git commit best practices
│   ├── CI_CD_EXPLAINED.md        # CI/CD guide
│   └── FOLDER_STRUCTURE.md       # This file
│
├── archived/                      # Old/deprecated code (moved here)
│   ├── server/                    # Old Express backend
│   ├── backend/                   # Another old backend
│   ├── api/                       # Old API
│   └── db/                        # Old database code
│
├── docker-compose.yml             # Development setup
├── docker-compose.prod.yml        # Production setup
├── README.md                      # Main project README
├── PROJECT_SUMMARY.md             # Architecture overview
├── INTERVIEW_PREP.md              # Interview preparation
├── DIGITALOCEAN_DEPLOYMENT_GUIDE.md  # Deployment guide
└── FINAL_STATUS.md                # Project completion status

```

---

## What Each Folder Does

### `/.github/workflows/`
**Purpose**: CI/CD automation with GitHub Actions

**Contents**:
- `ci.yml` - Runs tests, linting, and builds on every push
- `deploy.yml` - Deploys to DigitalOcean

**Why**: Automates quality checks and deployment

---

### `/nestjs-backend/`
**Purpose**: Main backend application (NestJS + TypeScript)

**Structure**:
```
nestjs-backend/
├── src/
│   ├── auth/              # JWT authentication, guards, strategies
│   ├── users/             # User CRUD, profile management
│   ├── products/          # Product management with caching
│   ├── categories/        # Category management
│   ├── orders/            # Order processing with transactions
│   ├── cart/              # Shopping cart operations
│   ├── wishlist/          # User wishlist
│   ├── settings/          # Key-value app settings
│   ├── images/            # Image upload management
│   ├── news/              # News/blog posts
│   ├── dashboard/         # Admin analytics
│   ├── rabbitmq/          # Message queue service
│   ├── redis/             # Caching service
│   ├── common/            # Shared code
│   │   ├── decorators/    # Custom decorators
│   │   ├── filters/       # Exception filters
│   │   ├── guards/        # Auth/Admin guards
│   │   ├── interceptors/  # Logging, caching, transforms
│   │   └── pipes/         # Validation pipes
│   ├── config/            # TypeORM and app config
│   ├── app.module.ts      # Root module
│   └── main.ts            # Entry point
├── dist/                  # Compiled JavaScript (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── Dockerfile             # Docker image definition
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

**Why**: Organized by feature (not by layer) for better maintainability

---

### `/client/`
**Purpose**: React frontend application

**Structure**:
```
client/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components
│   ├── contexts/          # React context providers
│   ├── layouts/           # Layout components
│   ├── utils/             # Utility functions
│   └── locales/           # i18n translations
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

**Why**: Standard React app structure

---

### `/docs/`
**Purpose**: All project documentation

**Files**:
- `COMMIT_GUIDE.md` - How to write good commit messages
- `CI_CD_EXPLAINED.md` - CI/CD pipeline explanation
- `FOLDER_STRUCTURE.md` - This file

**Why**: Centralized documentation for easy reference

---

### `/archived/`
**Purpose**: Old code that's no longer used but kept for reference

**Contents**:
- Old Express backend (`server/`)
- Previous backend versions (`backend/`, `api/`)
- Old database code (`db/`)

**Why**: Don't delete history, but keep it out of the way

---

## File Naming Conventions

### TypeScript Files

```typescript
// Entities (database models)
user.entity.ts
product.entity.ts

// Services (business logic)
users.service.ts
products.service.ts

// Controllers (API endpoints)
users.controller.ts
products.controller.ts

// DTOs (data validation)
create-user.dto.ts
update-product.dto.ts

// Modules (feature containers)
users.module.ts
products.module.ts

// Guards (authentication/authorization)
jwt-auth.guard.ts
admin.guard.ts

// Interceptors (request/response handling)
logging.interceptor.ts
cache.interceptor.ts
```

### Documentation Files

```
README.md                    # Main readme
PROJECT_SUMMARY.md          # Architecture
COMMIT_GUIDE.md             # Git guide
CI_CD_EXPLAINED.md          # CI/CD guide
DIGITALOCEAN_DEPLOYMENT_GUIDE.md  # Deployment
```

**Pattern**: `UPPERCASE_WITH_UNDERSCORES.md` for root docs

---

## What's Been Cleaned Up

### Removed (47 → 5 MD files)

**Deleted** (moved to archive or removed):
- All `*_FIX.md`, `*_COMPLETE.md`, `*_SUMMARY.md` files
- Duplicate deployment guides
- Old AWS, Vercel, Supabase guides
- Progress tracking files
- Bug fix documentation
- Screenshot documentation

**Kept** (essential only):
- `README.md` - Project overview
- `PROJECT_SUMMARY.md` - Architecture
- `INTERVIEW_PREP.md` - Interview prep
- `DIGITALOCEAN_DEPLOYMENT_GUIDE.md` - Deployment
- `FINAL_STATUS.md` - Current status

---

## Folder Organization Best Practices

### ✅ Good Structure

```
✅ Group by feature (not by type)
products/
  ├── products.controller.ts
  ├── products.service.ts
  ├── products.module.ts
  ├── entities/
  └── dto/

✅ Shared code in common/
common/
  ├── guards/
  ├── interceptors/
  └── filters/

✅ Clear naming
create-product.dto.ts  (not productDto.ts)
jwt-auth.guard.ts     (not auth.ts)
```

### ❌ Bad Structure

```
❌ Group by type (hard to find related files)
controllers/
  ├── products.controller.ts
  ├── users.controller.ts
services/
  ├── products.service.ts
  ├── users.service.ts

❌ Unclear naming
prod.ts
utils.ts
helper.ts
```

---

## .gitignore Configuration

Important files to ignore:

```gitignore
# Dependencies
node_modules/
*/node_modules/

# Build output
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Docker
.docker/

# Testing
coverage/
```

---

## When to Create New Folders

### Create a new module when:
1. **Feature is complex** - Has multiple files (controller, service, DTOs, entities)
2. **Reusable** - Other modules might need it
3. **Independent** - Can work standalone

### Keep in existing module when:
1. **Simple** - Just one or two files
2. **Related** - Tightly coupled to existing module
3. **Temporary** - Might change or be removed

---

## Navigation Tips

### Finding Files Quickly

```bash
# Find all controllers
find nestjs-backend/src -name "*.controller.ts"

# Find specific module
find nestjs-backend/src -type d -name "products"

# Search in files
grep -r "ProductsService" nestjs-backend/src
```

### VS Code Navigation

- `Cmd + P` - Quick file open
- `Cmd + Shift + F` - Search in files
- `Cmd + Click` - Go to definition
- `F12` - Go to definition
- `Shift + F12` - Find all references

---

## Summary

**Clean Structure = Easy to Navigate**

- Group by feature, not by type
- Clear, descriptive names
- Separate concerns (common/, config/)
- Archive old code instead of deleting
- Keep documentation centralized

**Result**: Anyone (including interviewers!) can understand your project structure instantly.

