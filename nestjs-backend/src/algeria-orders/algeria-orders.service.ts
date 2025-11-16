import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlgeriaOrder } from './entities/algeria-order.entity';
import { CreateAlgeriaOrderDto } from './dto/create-algeria-order.dto';
import { UpdateAlgeriaOrderDto } from './dto/update-algeria-order.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class AlgeriaOrdersService {
  private readonly logger = new Logger(AlgeriaOrdersService.name);

  constructor(
    @InjectRepository(AlgeriaOrder)
    private algeriaOrderRepository: Repository<AlgeriaOrder>,
    private rabbitMQService: RabbitMQService,
  ) {}

  async create(createAlgeriaOrderDto: CreateAlgeriaOrderDto): Promise<AlgeriaOrder> {
    this.logger.log('Creating new Algeria order...');

    // Create the order
    const order = this.algeriaOrderRepository.create(createAlgeriaOrderDto);
    const savedOrder = await this.algeriaOrderRepository.save(order);

    this.logger.log(`Order created with ID: ${savedOrder.id}`);

    // 🔔 Send notification to RabbitMQ for admin dashboard
    try {
      await this.rabbitMQService.emit('order.created', {
        orderId: savedOrder.id,
        customerName: savedOrder.customerName,
        productName: savedOrder.productName,
        totalPrice: savedOrder.totalPrice,
        wilaya: savedOrder.wilaya,
        phone: savedOrder.phone,
        createdAt: savedOrder.createdAt,
        message: `New order from ${savedOrder.customerName} for ${savedOrder.productName}`,
      });

      this.logger.log(`✅ Order notification sent to RabbitMQ for order ID: ${savedOrder.id}`);
    } catch (error) {
      // Don't fail the order creation if notification fails
      this.logger.error(`❌ Failed to send order notification to RabbitMQ: ${error.message}`);
    }

    return savedOrder;
  }

  async findAll(): Promise<AlgeriaOrder[]> {
    return this.algeriaOrderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AlgeriaOrder> {
    const order = await this.algeriaOrderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateAlgeriaOrderDto: UpdateAlgeriaOrderDto): Promise<AlgeriaOrder> {
    const order = await this.findOne(id);
    
    const oldStatus = order.status;
    Object.assign(order, updateAlgeriaOrderDto);
    const updatedOrder = await this.algeriaOrderRepository.save(order);

    // 🔔 Send status update notification if status changed
    if (updateAlgeriaOrderDto.status && oldStatus !== updateAlgeriaOrderDto.status) {
      try {
        await this.rabbitMQService.emit('order.status_updated', {
          orderId: updatedOrder.id,
          customerName: updatedOrder.customerName,
          oldStatus,
          newStatus: updatedOrder.status,
          message: `Order #${updatedOrder.id} status changed from ${oldStatus} to ${updatedOrder.status}`,
        });

        this.logger.log(`✅ Status update notification sent for order ID: ${updatedOrder.id}`);
      } catch (error) {
        this.logger.error(`❌ Failed to send status update notification: ${error.message}`);
      }
    }

    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.algeriaOrderRepository.remove(order);
  }

  // Get orders by status
  async findByStatus(status: string): Promise<AlgeriaOrder[]> {
    return this.algeriaOrderRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  // Get recent orders (last 24 hours)
  async getRecentOrders(): Promise<AlgeriaOrder[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return this.algeriaOrderRepository
      .createQueryBuilder('order')
      .where('order.createdAt >= :yesterday', { yesterday })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }
}

