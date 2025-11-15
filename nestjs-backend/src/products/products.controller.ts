/**
 * Products Controller - Best Practices Example
 *
 * Shows:
 * - Proper HTTP status codes
 * - Request validation
 * - Error handling
 * - Documentation comments
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('products') // All routes start with /api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /api/products/public
   * Public route - no authentication needed
   * Returns only available products
   */
  @Public()
  @Get('public')
  @HttpCode(HttpStatus.OK)
  async getPublicProducts() {
    return this.productsService.getPublicProducts();
  }

  /**
   * GET /api/products/:id/public
   * Public route - get single available product
   */
  @Public()
  @Get(':id/public')
  @HttpCode(HttpStatus.OK)
  async getPublicProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getPublicProductById(id);
  }

  /**
   * GET /api/products
   * Protected route - requires JWT token
   * Returns all products (including unavailable)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.productsService.findAll();
  }

  /**
   * GET /api/products/:id
   * Protected route - get single product
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * POST /api/products
   * Protected route - create new product
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * PATCH /api/products/:id
   * Protected route - update product
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /api/products/:id
   * Protected route - delete product
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }
}
