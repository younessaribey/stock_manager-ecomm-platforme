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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const user_entity_1 = require("../users/entities/user.entity");
const product_entity_1 = require("../products/entities/product.entity");
let CartService = class CartService {
    constructor(cartRepository, userRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }
    async findUserCart(userId) {
        return this.cartRepository.find({
            where: { userId },
            relations: ['product'],
        });
    }
    async addToCart(userId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        let cartItem = await this.cartRepository.findOne({
            where: { userId, productId },
        });
        if (cartItem) {
            cartItem.quantity += quantity;
        }
        else {
            cartItem = this.cartRepository.create({
                userId,
                productId,
                quantity,
            });
        }
        return this.cartRepository.save(cartItem);
    }
    async removeFromCart(userId, productId) {
        const result = await this.cartRepository.delete({ userId, productId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Cart item with product ID ${productId} not found for user ID ${userId}`);
        }
    }
    async updateCartItem(userId, productId, updateCartItemDto) {
        const { quantity } = updateCartItemDto;
        const cartItem = await this.cartRepository.findOne({
            where: { userId, productId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart item with product ID ${productId} not found for user ID ${userId}`);
        }
        cartItem.quantity = quantity;
        return this.cartRepository.save(cartItem);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map