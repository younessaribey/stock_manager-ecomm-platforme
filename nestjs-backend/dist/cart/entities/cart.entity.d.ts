import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Cart {
    id: number;
    quantity: number;
    userId: number;
    productId: number;
    user: User;
    product: Product;
}
