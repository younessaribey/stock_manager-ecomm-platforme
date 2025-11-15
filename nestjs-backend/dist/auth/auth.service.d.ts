import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
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
    private generateToken;
    validateUser(userId: number): Promise<import("../users/entities/user.entity").User>;
}
