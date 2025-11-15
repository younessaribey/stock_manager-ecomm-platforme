import { ClientProxy } from '@nestjs/microservices';
export declare class RabbitMQService {
    private readonly client;
    private readonly logger;
    constructor(client: ClientProxy);
    sendMessage<T = any>(pattern: string, data: unknown): Promise<T>;
    emitEvent(pattern: string, data: unknown): Promise<void>;
    sendOrderNotification(orderData: Record<string, unknown>): Promise<void>;
    sendProductUpdate(productData: Record<string, unknown>): Promise<void>;
}
