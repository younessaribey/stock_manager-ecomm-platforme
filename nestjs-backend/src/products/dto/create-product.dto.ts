/**
 * STEP 2: Create Product DTO
 */

import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  createdBy: number;

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
  @Min(0)
  @Max(100)
  batteryHealth?: number;

  @IsOptional()
  @IsEnum(['available', 'sold', 'pending'])
  status?: 'available' | 'sold' | 'pending';
}
