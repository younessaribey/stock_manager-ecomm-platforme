/**
 * Products Service - Best Practices Example
 *
 * Shows:
 * - Proper error handling
 * - Caching with Redis
 * - Type safety
 * - Logging
 * - Transaction support
 */

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private redisService: RedisService,
    private dataSource: DataSource, // For transactions
  ) {}

  /**
   * Get all products (authenticated)
   * Best Practice: Cache expensive queries
   */
  async findAll(): Promise<Product[]> {
    const cacheKey = 'products:all';

    // Try cache first
    const cached = await this.redisService.get<Product[]>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached products');
      return cached;
    }

    // If not cached, fetch from database
    const products = await this.productRepository.find({
      relations: ['category', 'createdByUser'],
      order: { createdAt: 'DESC' },
    });

    // Cache for 5 minutes
    await this.redisService.set(cacheKey, products, 300);

    return products;
  }

  /**
   * Get public products (available only)
   * Best Practice: Separate public/private methods
   */
  async getPublicProducts(): Promise<Product[]> {
    const cacheKey = 'products:public';

    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        return this.productRepository.find({
          where: { status: 'available' },
          relations: ['category'],
          order: { createdAt: 'DESC' },
        });
      },
      300, // 5 minutes cache
    );
  }

  /**
   * Get product by ID
   * Best Practice: Proper error handling with meaningful messages
   */
  async findOne(id: number): Promise<Product> {
    if (!id || id <= 0) {
      throw new NotFoundException('Invalid product ID');
    }

    const cacheKey = `product:${id}`;

    const product = await this.redisService.getOrSet(
      cacheKey,
      async () => {
        const found = await this.productRepository.findOne({
          where: { id },
          relations: ['category', 'createdByUser'],
        });

        if (!found) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return found;
      },
      300,
    );

    return product;
  }

  /**
   * Get public product by ID
   */
  async getPublicProductById(id: number): Promise<Product> {
    if (!id || id <= 0) {
      throw new NotFoundException('Invalid product ID');
    }

    const product = await this.productRepository.findOne({
      where: { id, status: 'available' },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found or not available`);
    }

    return product;
  }

  /**
   * Create new product
   * Best Practice: Use transactions for data consistency
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = this.productRepository.create(createProductDto);
      const savedProduct = await queryRunner.manager.save(Product, product);

      // Invalidate cache
      await this.redisService.del('products:all');
      await this.redisService.del('products:public');

      await queryRunner.commitTransaction();

      this.logger.log(`Product created: ${savedProduct.id} - ${savedProduct.name}`);

      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create product: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update product
   * Best Practice: Invalidate related cache
   */
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id); // This validates existence

    Object.assign(product, updateProductDto);
    const updated = await this.productRepository.save(product);

    // Invalidate cache
    await this.redisService.del(`product:${id}`);
    await this.redisService.del('products:all');
    await this.redisService.del('products:public');

    this.logger.log(`Product updated: ${id}`);

    return updated;
  }

  /**
   * Delete product
   * Best Practice: Soft delete or hard delete with cleanup
   */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id); // This validates existence

    await this.productRepository.remove(product);

    // Invalidate cache
    await this.redisService.del(`product:${id}`);
    await this.redisService.del('products:all');
    await this.redisService.del('products:public');

    this.logger.log(`Product deleted: ${id}`);
  }
}
