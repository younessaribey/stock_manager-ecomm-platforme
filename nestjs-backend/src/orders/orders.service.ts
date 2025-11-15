import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderItems } = createOrderDto;

    let total = 0;
    for (const item of orderItems) {
      // In a real app, you'd fetch the product price from the database
      // For simplicity, we'll assume a fixed price or that it's passed in the DTO
      total += 10 * item.quantity; // Placeholder price
    }

    const order = this.orderRepository.create({
      userId,
      total,
      status: 'pending',
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedOrder = await queryRunner.manager.save(Order, order);

      for (const item of orderItems) {
        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          productPrice: 10, // Placeholder price
        });
        await queryRunner.manager.save(OrderItem, orderItem);
      }

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
    });
  }
}
