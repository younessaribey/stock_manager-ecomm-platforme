import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlgeriaOrdersService } from './algeria-orders.service';
import { AlgeriaOrdersController } from './algeria-orders.controller';
import { AlgeriaOrder } from './entities/algeria-order.entity';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([AlgeriaOrder]), RabbitMQModule],
  controllers: [AlgeriaOrdersController],
  providers: [AlgeriaOrdersService],
  exports: [AlgeriaOrdersService],
})
export class AlgeriaOrdersModule {}

