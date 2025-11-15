import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    total: number;
    status: string;
    userId: number;
    user: User;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
