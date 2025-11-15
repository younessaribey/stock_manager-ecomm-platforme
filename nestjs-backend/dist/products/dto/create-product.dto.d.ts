export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    categoryId: number;
    createdBy: number;
    imageUrl?: string;
    images?: string;
    imei?: string;
    condition?: 'new' | 'used' | 'refurbished';
    storage?: string;
    color?: string;
    model?: string;
    batteryHealth?: number;
    status?: 'available' | 'sold' | 'pending';
}
