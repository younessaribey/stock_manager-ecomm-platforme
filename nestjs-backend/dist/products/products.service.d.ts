import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RedisService } from '../redis/redis.service';
export declare class ProductsService {
    private productRepository;
    private redisService;
    private dataSource;
    private readonly logger;
    constructor(productRepository: Repository<Product>, redisService: RedisService, dataSource: DataSource);
    findAll(): Promise<Product[]>;
    getPublicProducts(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    getPublicProductById(id: number): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
