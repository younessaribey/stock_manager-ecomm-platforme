# NestJS Migration Guide

## Overview

This guide explains how to port your Express.js application to NestJS for DigitalOcean deployment.

## What's Already Done ✅

1. **NestJS Project Structure** - Created in `nestjs-backend/`
2. **Docker Setup** - Docker Compose with PostgreSQL and RabbitMQ
3. **TypeORM Configuration** - Database connection setup
4. **RabbitMQ Module** - Message queue integration
5. **Basic App Module** - Main application structure

## What Needs to Be Ported 🔄

### 1. Database Models → TypeORM Entities

**Current**: Sequelize models in `server/config/dbSequelize.js`  
**Target**: TypeORM entities in `nestjs-backend/src/*/entities/`

**Example - User Entity**:
```typescript
// nestjs-backend/src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Product, product => product.createdBy)
  products: Product[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
```

### 2. Express Routes → NestJS Controllers

**Current**: `server/routes/*.js`  
**Target**: `nestjs-backend/src/*/*.controller.ts`

**Example - Products Controller**:
```typescript
// nestjs-backend/src/products/products.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('public')
  getPublicProducts() {
    return this.productsService.getPublicProducts();
  }

  @Get(':id/public')
  getPublicProductById(@Param('id') id: number) {
    return this.productsService.getPublicProductById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

### 3. Express Controllers → NestJS Services

**Current**: `server/controllers/*.js`  
**Target**: `nestjs-backend/src/*/*.service.ts`

**Example - Products Service**:
```typescript
// nestjs-backend/src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'createdBy'],
    });
  }

  async getPublicProducts(): Promise<Product[]> {
    return this.productRepository.find({
      where: { status: 'available' },
      relations: ['category'],
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }
}
```

### 4. Express Middleware → NestJS Guards/Interceptors

**Current**: `server/middlewares/auth.js`  
**Target**: `nestjs-backend/src/auth/guards/jwt-auth.guard.ts`

**Example - JWT Auth Guard**:
```typescript
// nestjs-backend/src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```

## Migration Steps

### Step 1: Create TypeORM Entities

For each Sequelize model, create a TypeORM entity:

1. **User** → `nestjs-backend/src/users/entities/user.entity.ts`
2. **Product** → `nestjs-backend/src/products/entities/product.entity.ts`
3. **Category** → `nestjs-backend/src/categories/entities/category.entity.ts`
4. **Order** → `nestjs-backend/src/orders/entities/order.entity.ts`
5. **OrderItem** → `nestjs-backend/src/orders/entities/order-item.entity.ts`
6. **Cart** → `nestjs-backend/src/cart/entities/cart.entity.ts`
7. **Wishlist** → `nestjs-backend/src/wishlist/entities/wishlist.entity.ts`
8. **Setting** → `nestjs-backend/src/settings/entities/setting.entity.ts`
9. **ImgBBImage** → `nestjs-backend/src/images/entities/imgbb-image.entity.ts`

### Step 2: Create DTOs (Data Transfer Objects)

Create DTOs for request validation:

```typescript
// nestjs-backend/src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsEnum(['new', 'used', 'refurbished'])
  condition?: string;
}
```

### Step 3: Create Modules

For each feature, create a module:

```
nestjs-backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/
│   └── strategies/
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── entities/
│   └── dto/
├── categories/
├── orders/
├── cart/
├── wishlist/
└── ...
```

### Step 4: Port Business Logic

Move logic from Express controllers to NestJS services, keeping the same functionality.

### Step 5: Update Dependencies

The NestJS `package.json` already includes all necessary dependencies. Just run:

```bash
cd nestjs-backend
npm install
```

## Quick Start (Minimal Port)

If you want to get running quickly, you can:

1. **Keep Express server** and just Dockerize it
2. **Port only critical modules** first (Auth, Products)
3. **Gradually migrate** other modules

## Alternative: Keep Express

If you prefer not to port to NestJS, you can:

1. Use the existing `server/` directory
2. Create a Dockerfile for Express
3. Update `docker-compose.prod.yml` to use Express server
4. Keep Sequelize (it works fine with Docker)

Would you like me to:
- **Option A**: Create a complete NestJS port (all modules)
- **Option B**: Create a hybrid setup (Express + Docker)
- **Option C**: Create skeleton modules you can fill in

Let me know which approach you prefer!

