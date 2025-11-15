import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async findByUser(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product'],
      order: { id: 'DESC' },
    });
  }

  async addToWishlist(userId: number, productId: number): Promise<Wishlist> {
    // Verify user and product exist
    await this.usersService.findOne(userId);
    await this.productsService.findOne(productId);

    // Check if already in wishlist
    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (existing) {
      return existing;
    }

    const wishlistItem = this.wishlistRepository.create({
      userId,
      productId,
    });

    return this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Item not found in wishlist');
    }

    await this.wishlistRepository.remove(wishlistItem);
  }

  async clearWishlist(userId: number): Promise<void> {
    await this.wishlistRepository.delete({ userId });
  }
}
