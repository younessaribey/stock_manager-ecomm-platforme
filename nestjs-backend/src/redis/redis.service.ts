/**
 * Redis Service - Best Practices
 *
 * Provides Redis operations with:
 * - Proper error handling
 * - Connection management
 * - Type safety
 * - Logging
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType | null = null;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  /**
   * Initialize Redis connection on module init
   */
  async onModuleInit(): Promise<void> {
    try {
      const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
      const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD', '');

      this.client = createClient({
        socket: {
          host: redisHost,
          port: redisPort,
        },
        password: redisPassword || undefined,
      });

      this.client.on('error', (err) => {
        this.logger.error(`Redis Client Error: ${err.message}`, err.stack);
      });

      this.client.on('connect', () => {
        this.logger.log('Redis Client Connected');
      });

      await this.client.connect();
      this.logger.log(`Redis connected to ${redisHost}:${redisPort}`);
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      // Don't throw - app can work without Redis (graceful degradation)
    }
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  /**
   * Get value from cache
   * Best Practice: Always handle errors gracefully
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.warn(`Cache get error for key ${key}: ${error.message}`);
      return undefined; // Graceful degradation
    }
  }

  /**
   * Set value in cache
   * Best Practice: Use TTL for automatic expiration
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl || 300); // Default 5 minutes
    } catch (error) {
      this.logger.warn(`Cache set error for key ${key}: ${error.message}`);
      // Don't throw - caching is not critical
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.warn(`Cache delete error for key ${key}: ${error.message}`);
    }
  }

  /**
   * Clear all cache
   */
  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.warn(`Cache reset error: ${error.message}`);
    }
  }

  /**
   * Get or set pattern (cache-aside pattern)
   * Best Practice: Common caching pattern
   */
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    // If not in cache, fetch and store
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (this.client) {
        return (await this.client.exists(key)) === 1;
      }
      return false;
    } catch (error) {
      this.logger.warn(`Cache exists error for key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Set expiration on key
   */
  async expire(key: string, seconds: number): Promise<void> {
    try {
      if (this.client) {
        await this.client.expire(key, seconds);
      }
    } catch (error) {
      this.logger.warn(`Cache expire error for key ${key}: ${error.message}`);
    }
  }

  /**
   * Increment counter (useful for rate limiting)
   */
  async increment(key: string, by = 1): Promise<number> {
    try {
      if (this.client) {
        return await this.client.incrBy(key, by);
      }
      return 0;
    } catch (error) {
      this.logger.warn(`Cache increment error for key ${key}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Get Redis client (for advanced operations)
   */
  getClient(): RedisClientType | null {
    return this.client;
  }
}
