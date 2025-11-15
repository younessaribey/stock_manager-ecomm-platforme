"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = exports.CACHE_TTL = exports.CACHE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.CACHE_KEY = 'cache:key';
exports.CACHE_TTL = 'cache:ttl';
const Cache = (key, ttl = 300) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(exports.CACHE_KEY, key)(target, propertyKey, descriptor);
        (0, common_1.SetMetadata)(exports.CACHE_TTL, ttl)(target, propertyKey, descriptor);
    };
};
exports.Cache = Cache;
//# sourceMappingURL=cache.decorator.js.map