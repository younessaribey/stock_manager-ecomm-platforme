import { IsString, IsNumber, IsEmail, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlgeriaOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  address: string;

  @IsString()
  wilaya: string;

  @Type(() => Number)
  @IsNumber()
  productId: number;

  @IsString()
  productName: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  productPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

