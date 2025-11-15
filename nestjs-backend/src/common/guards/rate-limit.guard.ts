/**
 * Rate Limit Guard - Best Practice
 *
 * Prevents abuse by limiting requests per IP
 * Uses Redis for distributed rate limiting
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';

export const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (maxRequests: number, windowSeconds: number) => {
  return Reflector.createDecorator<{ maxRequests: number; windowSeconds: number }>()({
    maxRequests,
    windowSeconds,
  });
};

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private redisService: RedisService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;

    // Get rate limit configuration from decorator
    const rateLimitConfig = this.reflector.get<{ maxRequests: number; windowSeconds: number }>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    // Default values if no decorator
    const maxRequests = rateLimitConfig?.maxRequests ?? 100;
    const windowSeconds = rateLimitConfig?.windowSeconds ?? 60;

    const key = `rate_limit:${ip}`;

    // Get current count
    const count = await this.redisService.increment(key);

    // Set expiration on first request
    if (count === 1) {
      await this.redisService.expire(key, windowSeconds);
    }

    // Check limit
    if (count > maxRequests) {
      throw new HttpException(
        {
          success: false,
          message: 'Too many requests, please try again later',
          retryAfter: windowSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
