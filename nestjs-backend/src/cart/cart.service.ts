import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findUserCart(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    let cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartRepository.create({
        userId,
        productId,
        quantity,
      });
    }

    return this.cartRepository.save(cartItem);
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    const result = await this.cartRepository.delete({ userId, productId });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Cart item with product ID ${productId} not found for user ID ${userId}`,
      );
    }
  }

  async updateCartItem(
    userId: number,
    productId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Cart item with product ID ${productId} not found for user ID ${userId}`,
      );
    }

    cartItem.quantity = quantity;
    return this.cartRepository.save(cartItem);
  }
}
