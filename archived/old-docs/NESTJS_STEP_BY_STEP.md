# NestJS Migration - Step by Step Guide

## 🎓 Learning Path: Express → NestJS

This guide will teach you NestJS by migrating your Express app step-by-step.

---

## 📚 Understanding NestJS Architecture

### Key Concepts:

1. **Modules** (`*.module.ts`) - Organize code into features
2. **Controllers** (`*.controller.ts`) - Handle HTTP requests (like Express routes)
3. **Services** (`*.service.ts`) - Business logic (like Express controllers)
4. **Entities** (`*.entity.ts`) - Database models (like Sequelize models)
5. **DTOs** (`*.dto.ts`) - Data validation (like Joi/express-validator)
6. **Guards** (`*.guard.ts`) - Authentication/Authorization (like Express middleware)

### Comparison:

| Express | NestJS |
|---------|--------|
| `routes/auth.js` | `auth/auth.controller.ts` |
| `controllers/authController.js` | `auth/auth.service.ts` |
| `models/User.js` (Sequelize) | `users/entities/user.entity.ts` (TypeORM) |
| `middlewares/auth.js` | `auth/guards/jwt-auth.guard.ts` |
| `app.use('/api/auth', authRoutes)` | `@Controller('auth')` |

---

## Step 1: Create TypeORM Entities (Database Models)

**What we're doing**: Converting Sequelize models to TypeORM entities

### 1.1 User Entity

**Location**: `nestjs-backend/src/users/entities/user.entity.ts`

**What this does**: Defines the User table structure with TypeORM decorators

**Key Decorators**:
- `@Entity()` - Marks class as database table
- `@Column()` - Marks property as table column
- `@PrimaryGeneratedColumn()` - Auto-incrementing primary key
- `@OneToMany()` / `@ManyToOne()` - Relationships

---

## Step 2: Create DTOs (Data Transfer Objects)

**What we're doing**: Creating validation classes for request/response data

**Why**: TypeScript + class-validator gives us type safety and automatic validation

---

## Step 3: Create Services (Business Logic)

**What we're doing**: Moving logic from Express controllers to NestJS services

**Key Points**:
- Services are injectable (`@Injectable()`)
- Use dependency injection to get repositories
- Services contain all business logic

---

## Step 4: Create Controllers (API Endpoints)

**What we're doing**: Converting Express routes to NestJS controllers

**Key Decorators**:
- `@Controller('products')` - Route prefix
- `@Get()`, `@Post()`, `@Put()`, `@Delete()` - HTTP methods
- `@UseGuards()` - Apply authentication
- `@Body()`, `@Param()`, `@Query()` - Extract request data

---

## Step 5: Create Guards (Authentication)

**What we're doing**: Converting Express middleware to NestJS guards

**Key Points**:
- Guards run before route handlers
- Can access request/response
- Can throw exceptions to block requests

---

## Step 6: Create Modules

**What we're doing**: Organizing everything into feature modules

**Key Points**:
- Each feature has its own module
- Modules import what they need
- Root module (AppModule) imports all feature modules

---

## 🚀 Let's Start Building!

Follow the files in this order:

1. **Entities** (database models)
2. **DTOs** (validation)
3. **Services** (business logic)
4. **Controllers** (API endpoints)
5. **Guards** (authentication)
6. **Modules** (organization)

Each file has comments explaining what it does!

