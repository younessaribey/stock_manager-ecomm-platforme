import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
export declare const RATE_LIMIT_KEY = "rateLimit";
export declare const RateLimit: (maxRequests: number, windowSeconds: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare class RateLimitGuard implements CanActivate {
    private redisService;
    constructor(redisService: RedisService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
