/**
 * STEP 6: Categories Module (Skeleton)
 *
 * Complete this following the same pattern as ProductsModule
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
// TODO: Create CategoriesService and CategoriesController

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  // TODO: Add controllers and providers
})
export class CategoriesModule {}
