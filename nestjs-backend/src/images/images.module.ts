/**
 * STEP 6: Images Module (Skeleton)
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgBBImage } from './entities/imgbb-image.entity';
// TODO: Create ImagesService and ImagesController

@Module({
  imports: [TypeOrmModule.forFeature([ImgBBImage])],
  // TODO: Add controllers and providers
})
export class ImagesModule {}
