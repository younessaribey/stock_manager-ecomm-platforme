import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { Setting } from '../settings/entities/setting.entity';
import { ImgBBImage } from '../images/entities/imgbb-image.entity';
import { AlgeriaOrder } from '../algeria-orders/entities/algeria-order.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USER', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres'),
      database: this.configService.get('DB_NAME', 'stmg'),
      entities: [User, Product, Category, Order, OrderItem, Cart, Wishlist, Setting, ImgBBImage, AlgeriaOrder],
      synchronize: !isProduction, // Auto-sync in dev, use migrations in prod
      logging: !isProduction,
      ssl: isProduction
        ? {
            rejectUnauthorized: false,
          }
        : false,
      extra: {
        max: 10,
        connectionTimeoutMillis: 60000,
      },
    };
  }
}
