export declare const CACHE_KEY = "cache:key";
export declare const CACHE_TTL = "cache:ttl";
export declare const Cache: (key: string, ttl?: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
