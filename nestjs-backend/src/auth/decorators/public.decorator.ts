/**
 * STEP 5: Public Decorator
 *
 * Use this to mark routes as public (no auth required)
 *
 * Example:
 *   @Public()
 *   @Get('public')
 *   getPublicData() { ... }
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
