"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/entities/user.entity");
const product_entity_1 = require("../products/entities/product.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const cart_entity_1 = require("../cart/entities/cart.entity");
const wishlist_entity_1 = require("../wishlist/entities/wishlist.entity");
const setting_entity_1 = require("../settings/entities/setting.entity");
const imgbb_image_entity_1 = require("../images/entities/imgbb-image.entity");
let TypeOrmConfigService = class TypeOrmConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        return {
            type: 'postgres',
            host: this.configService.get('DB_HOST', 'localhost'),
            port: this.configService.get('DB_PORT', 5432),
            username: this.configService.get('DB_USER', 'postgres'),
            password: this.configService.get('DB_PASSWORD', 'postgres'),
            database: this.configService.get('DB_NAME', 'stmg'),
            entities: [
                user_entity_1.User,
                product_entity_1.Product,
                category_entity_1.Category,
                order_entity_1.Order,
                order_item_entity_1.OrderItem,
                cart_entity_1.Cart,
                wishlist_entity_1.Wishlist,
                setting_entity_1.Setting,
                imgbb_image_entity_1.ImgBBImage,
            ],
            synchronize: !isProduction,
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
};
exports.TypeOrmConfigService = TypeOrmConfigService;
exports.TypeOrmConfigService = TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeOrmConfigService);
//# sourceMappingURL=typeorm.config.js.map