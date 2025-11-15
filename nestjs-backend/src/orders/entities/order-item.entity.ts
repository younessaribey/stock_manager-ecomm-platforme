/**
 * STEP 1: OrderItem Entity
 *
 * Stores individual items in an order with product snapshot
 */

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'orderId' })
  orderId: number;

  @Column({ name: 'productId' })
  productId: number;

  // Product snapshot at time of order
  @Column({ nullable: true })
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  productPrice: number;

  @Column({ nullable: true })
  productImage: string;

  @Column({ nullable: true })
  productSku: string;

  @Column({ type: 'text', nullable: true })
  productDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  itemTotal: number;

  // Relationships
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
