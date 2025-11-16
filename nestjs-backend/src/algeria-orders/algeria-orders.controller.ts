import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlgeriaOrdersService } from './algeria-orders.service';
import { CreateAlgeriaOrderDto } from './dto/create-algeria-order.dto';
import { UpdateAlgeriaOrderDto } from './dto/update-algeria-order.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('algeria-orders')
export class AlgeriaOrdersController {
  constructor(private readonly algeriaOrdersService: AlgeriaOrdersService) {}

  /**
   * POST /api/algeria-orders
   * Public route - anyone can place an order
   */
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlgeriaOrderDto: CreateAlgeriaOrderDto) {
    return this.algeriaOrdersService.create(createAlgeriaOrderDto);
  }

  /**
   * GET /api/algeria-orders
   * Admin only - view all orders
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.algeriaOrdersService.findAll();
  }

  /**
   * GET /api/algeria-orders/recent
   * Admin only - view recent orders (last 24h)
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('recent')
  getRecentOrders() {
    return this.algeriaOrdersService.getRecentOrders();
  }

  /**
   * GET /api/algeria-orders/status/:status
   * Admin only - filter orders by status
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.algeriaOrdersService.findByStatus(status);
  }

  /**
   * GET /api/algeria-orders/:id
   * Admin only - view single order
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.algeriaOrdersService.findOne(id);
  }

  /**
   * PUT /api/algeria-orders/:id/status
   * Admin only - update order status
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: { status: string },
  ) {
    return this.algeriaOrdersService.update(id, updateDto);
  }

  /**
   * PATCH /api/algeria-orders/:id
   * Admin only - update order details
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlgeriaOrderDto: UpdateAlgeriaOrderDto,
  ) {
    return this.algeriaOrdersService.update(id, updateAlgeriaOrderDto);
  }

  /**
   * DELETE /api/algeria-orders/:id
   * Admin only - delete order
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.algeriaOrdersService.remove(id);
  }
}

