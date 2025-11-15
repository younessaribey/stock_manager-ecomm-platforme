import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgBBImage } from './entities/imgbb-image.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ImgBBImage])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
