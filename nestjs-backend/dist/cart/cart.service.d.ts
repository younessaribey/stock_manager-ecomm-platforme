import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private cartRepository;
    private userRepository;
    private productRepository;
    constructor(cartRepository: Repository<Cart>, userRepository: Repository<User>, productRepository: Repository<Product>);
    findUserCart(userId: number): Promise<Cart[]>;
    addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart>;
    removeFromCart(userId: number, productId: number): Promise<void>;
    updateCartItem(userId: number, productId: number, updateCartItemDto: UpdateCartItemDto): Promise<Cart>;
}
