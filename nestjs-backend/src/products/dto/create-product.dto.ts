/**
 * STEP 2: Create Product DTO
 */

import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdBy?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  images?: string;

  // Phone-specific fields
  @IsOptional()
  @IsString()
  imei?: string;

  @IsOptional()
  @IsEnum(['new', 'used', 'refurbished'])
  condition?: 'new' | 'used' | 'refurbished';

  @IsOptional()
  @IsString()
  storage?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  batteryHealth?: number;

  @IsOptional()
  @IsEnum(['available', 'sold', 'pending'])
  status?: 'available' | 'sold' | 'pending';
}
