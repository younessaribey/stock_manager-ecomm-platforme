/**
 * STEP 2: Update Product DTO
 *
 * PartialType makes all fields optional
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
