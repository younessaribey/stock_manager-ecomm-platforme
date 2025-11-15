/**
 * STEP 2: DTO (Data Transfer Object) - Register
 *
 * DTOs define the shape of data coming into your API.
 * They provide:
 * 1. Type safety (TypeScript)
 * 2. Automatic validation (class-validator)
 * 3. Documentation (Swagger can read them)
 *
 * In Express, you'd validate manually:
 *   if (!email || !password) return res.status(400)...
 *
 * In NestJS, decorators do it automatically!
 */

import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString() // Must be a string
  @IsOptional() // Optional field
  username?: string;

  @IsEmail() // Must be valid email format
  email: string;

  @IsString()
  @MinLength(6) // Minimum 6 characters
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
