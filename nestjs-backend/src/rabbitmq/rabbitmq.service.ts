import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendMessage<T = any>(pattern: string, data: unknown): Promise<T> {
    try {
      return await firstValueFrom(this.client.send<T>(pattern, data));
    } catch (error) {
      this.logger.error(`RabbitMQ send error for pattern ${pattern}:`, error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async emitEvent(pattern: string, data: unknown): Promise<void> {
    try {
      this.client.emit(pattern, data);
    } catch (error) {
      this.logger.error(`RabbitMQ emit error for pattern ${pattern}:`, error);
      throw error;
    }
  }

  // Example: Send order notification
  async sendOrderNotification(orderData: Record<string, unknown>): Promise<void> {
    await this.emitEvent('order.created', orderData);
  }

  // Example: Send product update notification
  async sendProductUpdate(productData: Record<string, unknown>): Promise<void> {
    await this.emitEvent('product.updated', productData);
  }
}
