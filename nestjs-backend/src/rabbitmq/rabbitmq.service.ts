import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

  async sendMessage(pattern: string, data: any): Promise<any> {
    try {
      return await firstValueFrom(this.client.send(pattern, data));
    } catch (error) {
      console.error('RabbitMQ error:', error);
      throw error;
    }
  }

  async emitEvent(pattern: string, data: any): Promise<void> {
    try {
      this.client.emit(pattern, data);
    } catch (error) {
      console.error('RabbitMQ emit error:', error);
      throw error;
    }
  }

  // Example: Send order notification
  async sendOrderNotification(orderData: any): Promise<void> {
    await this.emitEvent('order.created', orderData);
  }

  // Example: Send product update notification
  async sendProductUpdate(productData: any): Promise<void> {
    await this.emitEvent('product.updated', productData);
  }
}
