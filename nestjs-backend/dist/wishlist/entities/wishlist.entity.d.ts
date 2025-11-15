import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Wishlist {
    id: number;
    userId: number;
    productId: number;
    user: User;
    product: Product;
}
