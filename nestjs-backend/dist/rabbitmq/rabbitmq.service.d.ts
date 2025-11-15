import { ClientProxy } from '@nestjs/microservices';
export declare class RabbitMQService {
    private readonly client;
    constructor(client: ClientProxy);
    sendMessage(pattern: string, data: any): Promise<any>;
    emitEvent(pattern: string, data: any): Promise<void>;
    sendOrderNotification(orderData: any): Promise<void>;
    sendProductUpdate(productData: any): Promise<void>;
}
