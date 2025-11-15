/**
 * STEP 6: Cart Module (Skeleton)
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product]), UsersModule, ProductsModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
