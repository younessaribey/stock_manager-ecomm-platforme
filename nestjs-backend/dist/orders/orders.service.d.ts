import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private dataSource;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, dataSource: DataSource);
    create(userId: number, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(userId: number): Promise<Order[]>;
}
