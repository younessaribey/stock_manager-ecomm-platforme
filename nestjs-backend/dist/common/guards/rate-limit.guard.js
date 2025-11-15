"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = exports.RateLimit = exports.RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const redis_service_1 = require("../../redis/redis.service");
exports.RATE_LIMIT_KEY = 'rateLimit';
const RateLimit = (maxRequests, windowSeconds) => {
    return core_1.Reflector.createDecorator()({
        maxRequests,
        windowSeconds,
    });
};
exports.RateLimit = RateLimit;
let RateLimitGuard = class RateLimitGuard {
    constructor(redisService, reflector) {
        this.redisService = redisService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip || request.connection.remoteAddress;
        const rateLimitConfig = this.reflector.get(exports.RATE_LIMIT_KEY, context.getHandler());
        const maxRequests = rateLimitConfig?.maxRequests ?? 100;
        const windowSeconds = rateLimitConfig?.windowSeconds ?? 60;
        const key = `rate_limit:${ip}`;
        const count = await this.redisService.increment(key);
        if (count === 1) {
            await this.redisService.expire(key, windowSeconds);
        }
        if (count > maxRequests) {
            throw new common_1.HttpException({
                success: false,
                message: 'Too many requests, please try again later',
                retryAfter: windowSeconds,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map