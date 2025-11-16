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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';
import type { FileFilterCallback, File as MulterFile } from 'multer';

const productUploadsDir = join(process.cwd(), 'uploads', 'products');

const ensureUploadDirExists = () => {
  if (!existsSync(productUploadsDir)) {
    mkdirSync(productUploadsDir, { recursive: true });
  }
};

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDirExists();
    cb(null, productUploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

const imageFileFilter = (_req: Request, file: MulterFile, cb: FileFilterCallback) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Only image uploads are allowed'), false);
  }
  cb(null, true);
};

type UploadedProductFiles = {
  image?: MulterFile[];
  additionalImages?: MulterFile[];
};

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'additionalImages', maxCount: 8 },
      ],
      {
        storage,
        fileFilter: imageFileFilter,
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      },
    ),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFiles() files: UploadedProductFiles,
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ) {
    const uploadBasePath = '/uploads/products';

    if (files?.image?.length) {
      createProductDto.imageUrl = `${uploadBasePath}/${files.image[0].filename}`;
    }

    if (files?.additionalImages?.length) {
      const gallery = files.additionalImages.map((file) => `${uploadBasePath}/${file.filename}`);
      createProductDto.images = JSON.stringify(gallery);
    }

    createProductDto.createdBy = req.user?.id;

    if (!createProductDto.createdBy) {
      throw new BadRequestException('Unable to determine product owner');
    }

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
