import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
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

    await getManager().transaction(async (transactionalEntityManager) => {
      const savedOrder = await transactionalEntityManager.save(order);

      for (const item of orderItems) {
        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: 10, // Placeholder price
        });
        await transactionalEntityManager.save(orderItem);
      }
    });

    return order;
  }

  async findAll(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
    });
  }
}
