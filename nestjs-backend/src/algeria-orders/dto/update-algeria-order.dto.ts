import { PartialType } from '@nestjs/mapped-types';
import { CreateAlgeriaOrderDto } from './create-algeria-order.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAlgeriaOrderDto extends PartialType(CreateAlgeriaOrderDto) {
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  status?: string;
}

