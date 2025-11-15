import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
export declare class OrderItem {
    id: number;
    quantity: number;
    orderId: number;
    productId: number;
    productName: string;
    productPrice: number;
    productImage: string;
    productSku: string;
    productDescription: string;
    itemTotal: number;
    order: Order;
    product: Product;
}
