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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const redis_service_1 = require("../redis/redis.service");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(productRepository, redisService, dataSource) {
        this.productRepository = productRepository;
        this.redisService = redisService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    async findAll() {
        const cacheKey = 'products:all';
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            this.logger.debug('Returning cached products');
            return cached;
        }
        const products = await this.productRepository.find({
            relations: ['category', 'createdByUser'],
            order: { createdAt: 'DESC' },
        });
        await this.redisService.set(cacheKey, products, 300);
        return products;
    }
    async getPublicProducts() {
        const cacheKey = 'products:public';
        return this.redisService.getOrSet(cacheKey, async () => {
            return this.productRepository.find({
                where: { status: 'available' },
                relations: ['category'],
                order: { createdAt: 'DESC' },
            });
        }, 300);
    }
    async findOne(id) {
        if (!id || id <= 0) {
            throw new common_1.NotFoundException('Invalid product ID');
        }
        const cacheKey = `product:${id}`;
        const product = await this.redisService.getOrSet(cacheKey, async () => {
            const found = await this.productRepository.findOne({
                where: { id },
                relations: ['category', 'createdByUser'],
            });
            if (!found) {
                throw new common_1.NotFoundException(`Product with ID ${id} not found`);
            }
            return found;
        }, 300);
        return product;
    }
    async getPublicProductById(id) {
        if (!id || id <= 0) {
            throw new common_1.NotFoundException('Invalid product ID');
        }
        const product = await this.productRepository.findOne({
            where: { id, status: 'available' },
            relations: ['category'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found or not available`);
        }
        return product;
    }
    async create(createProductDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const product = this.productRepository.create(createProductDto);
            const savedProduct = await queryRunner.manager.save(product_entity_1.Product, product);
            await this.redisService.del('products:all');
            await this.redisService.del('products:public');
            await queryRunner.commitTransaction();
            this.logger.log(`Product created: ${savedProduct.id} - ${savedProduct.name}`);
            return savedProduct;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create product: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        const updated = await this.productRepository.save(product);
        await this.redisService.del(`product:${id}`);
        await this.redisService.del('products:all');
        await this.redisService.del('products:public');
        this.logger.log(`Product updated: ${id}`);
        return updated;
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
        await this.redisService.del(`product:${id}`);
        await this.redisService.del('products:all');
        await this.redisService.del('products:public');
        this.logger.log(`Product deleted: ${id}`);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map