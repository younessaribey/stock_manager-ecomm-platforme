import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            profilePicture: string;
            bio: string;
            role: string;
            approved: boolean;
            phone: string;
            address: string;
            profileImage: string;
            products: import("../products/entities/product.entity").Product[];
            orders: import("../orders/entities/order.entity").Order[];
            wishlists: import("../wishlist/entities/wishlist.entity").Wishlist[];
            carts: import("../cart/entities/cart.entity").Cart[];
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            profilePicture: string;
            bio: string;
            role: string;
            approved: boolean;
            phone: string;
            address: string;
            profileImage: string;
            products: import("../products/entities/product.entity").Product[];
            orders: import("../orders/entities/order.entity").Order[];
            wishlists: import("../wishlist/entities/wishlist.entity").Wishlist[];
            carts: import("../cart/entities/cart.entity").Cart[];
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getCurrentUser(req: any): Promise<any>;
}
