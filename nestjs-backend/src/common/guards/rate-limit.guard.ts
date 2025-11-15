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
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflector.prototype.get = function (key: string) {
      return { maxRequests, windowSeconds };
    };
  };
};

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    const key = `rate_limit:${ip}`;

    // Get current count
    const count = await this.redisService.increment(key);

    // Set expiration on first request
    if (count === 1) {
      await this.redisService.expire(key, 60); // 1 minute window
    }

    // Check limit (default: 100 requests per minute)
    const maxRequests = 100;
    if (count > maxRequests) {
      throw new HttpException(
        {
          success: false,
          message: 'Too many requests, please try again later',
          retryAfter: 60,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
