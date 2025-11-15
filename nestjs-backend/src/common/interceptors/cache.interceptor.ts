/**
 * Cache Interceptor - Best Practice
 *
 * Automatically caches method results based on @Cache decorator
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';
import { CACHE_KEY, CACHE_TTL } from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private redisService: RedisService,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheKey = this.reflector.get<string>(CACHE_KEY, context.getHandler());
    const cacheTtl = this.reflector.get<number>(CACHE_TTL, context.getHandler());

    if (!cacheKey) {
      return next.handle(); // No caching
    }

    // Try to get from cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return of(cached); // Return cached value
    }

    // If not cached, execute and cache result
    return next.handle().pipe(
      tap(async (data) => {
        await this.redisService.set(cacheKey, data, cacheTtl);
      }),
    );
  }
}
