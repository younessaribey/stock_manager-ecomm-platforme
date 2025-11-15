import { Product } from '../../products/entities/product.entity';
export declare class Category {
    id: number;
    name: string;
    parentId: number;
    level: number;
    isActive: boolean;
    parent: Category;
    subcategories: Category[];
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
