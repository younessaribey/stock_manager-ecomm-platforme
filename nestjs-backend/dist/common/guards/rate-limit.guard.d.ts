import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';
export declare const RATE_LIMIT_KEY = "rateLimit";
export declare const RateLimit: (maxRequests: number, windowSeconds: number) => import("@nestjs/common").CustomDecorator;
export declare class RateLimitGuard implements CanActivate {
    private redisService;
    private reflector;
    constructor(redisService: RedisService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
