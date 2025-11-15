/**
 * STEP 6: Wishlist Module (Skeleton)
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
// TODO: Create WishlistService and WishlistController

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])],
  // TODO: Add controllers and providers
})
export class WishlistModule {}
