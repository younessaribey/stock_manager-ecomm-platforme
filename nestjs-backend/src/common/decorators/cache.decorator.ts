/**
 * Cache Decorator - Best Practice
 *
 * Decorator to automatically cache method results
 *
 * Usage:
 *   @Cache('products', 300) // Cache for 5 minutes
 *   async getProducts() { ... }
 */

import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache:key';
export const CACHE_TTL = 'cache:ttl';

export const Cache = (key: string, ttl = 300) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY, key)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL, ttl)(target, propertyKey, descriptor);
  };
};
