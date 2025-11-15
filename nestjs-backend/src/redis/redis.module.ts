/**
 * Redis Module
 *
 * Provides Redis caching functionality.
 *
 * Uses:
 * - Session storage
 * - API response caching
 * - Rate limiting
 * - Real-time data
 */

import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';

@Global() // Make Redis available to all modules
@Module({
  imports: [
    // Configure cache manager with Redis
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (_configService: ConfigService) => {
        // Redis configuration is handled in RedisService
        // Cache manager uses memory store as fallback
        return {
          store: 'memory', // Fallback to memory if Redis not available
          ttl: 300, // Default TTL: 5 minutes
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisModule {}
