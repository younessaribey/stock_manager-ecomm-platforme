import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImgBBImage } from './entities/imgbb-image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImgBBImage)
    private imagesRepository: Repository<ImgBBImage>,
  ) {}

  async findAll(): Promise<ImgBBImage[]> {
    return this.imagesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: number): Promise<ImgBBImage[]> {
    return this.imagesRepository.find({
      where: { uploadedBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(imageData: Partial<ImgBBImage>): Promise<ImgBBImage> {
    const image = this.imagesRepository.create(imageData);
    return this.imagesRepository.save(image);
  }

  async remove(id: number): Promise<void> {
    await this.imagesRepository.delete(id);
  }
}
