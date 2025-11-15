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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RedisService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_2 = require("cache-manager");
const redis_1 = require("redis");
let RedisService = RedisService_1 = class RedisService {
    constructor(cacheManager, configService) {
        this.cacheManager = cacheManager;
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
        this.client = null;
    }
    async onModuleInit() {
        try {
            const redisHost = this.configService.get('REDIS_HOST', 'localhost');
            const redisPort = this.configService.get('REDIS_PORT', 6379);
            const redisPassword = this.configService.get('REDIS_PASSWORD', '');
            this.client = (0, redis_1.createClient)({
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
        }
        catch (error) {
            this.logger.error('Failed to connect to Redis', error);
        }
    }
    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
            this.logger.log('Redis connection closed');
        }
    }
    async get(key) {
        try {
            return await this.cacheManager.get(key);
        }
        catch (error) {
            this.logger.warn(`Cache get error for key ${key}: ${error.message}`);
            return undefined;
        }
    }
    async set(key, value, ttl) {
        try {
            await this.cacheManager.set(key, value, ttl || 300);
        }
        catch (error) {
            this.logger.warn(`Cache set error for key ${key}: ${error.message}`);
        }
    }
    async del(key) {
        try {
            await this.cacheManager.del(key);
        }
        catch (error) {
            this.logger.warn(`Cache delete error for key ${key}: ${error.message}`);
        }
    }
    async reset() {
        try {
            await this.cacheManager.reset();
        }
        catch (error) {
            this.logger.warn(`Cache reset error: ${error.message}`);
        }
    }
    async getOrSet(key, factory, ttl) {
        const cached = await this.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const value = await factory();
        await this.set(key, value, ttl);
        return value;
    }
    async exists(key) {
        try {
            if (this.client) {
                return (await this.client.exists(key)) === 1;
            }
            return false;
        }
        catch (error) {
            this.logger.warn(`Cache exists error for key ${key}: ${error.message}`);
            return false;
        }
    }
    async expire(key, seconds) {
        try {
            if (this.client) {
                await this.client.expire(key, seconds);
            }
        }
        catch (error) {
            this.logger.warn(`Cache expire error for key ${key}: ${error.message}`);
        }
    }
    async increment(key, by = 1) {
        try {
            if (this.client) {
                return await this.client.incrBy(key, by);
            }
            return 0;
        }
        catch (error) {
            this.logger.warn(`Cache increment error for key ${key}: ${error.message}`);
            return 0;
        }
    }
    getClient() {
        return this.client;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeof (_a = typeof cache_manager_2.Cache !== "undefined" && cache_manager_2.Cache) === "function" ? _a : Object, config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map