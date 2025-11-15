declare class OrderItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    orderItems: OrderItemDto[];
}
export {};
