import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Cart } from '../../cart/entities/cart.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    role: string;
    approved: boolean;
    phone: string;
    address: string;
    profileImage: string;
    products: Product[];
    orders: Order[];
    wishlists: Wishlist[];
    carts: Cart[];
    createdAt: Date;
    updatedAt: Date;
}
