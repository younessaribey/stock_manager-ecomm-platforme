/**
 * STEP 1: Product Entity
 *
 * Defines the Product table structure.
 * Shows relationships with Category and User.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true }) // JSON array stored as text
  images: string;

  // Phone-specific fields
  @Column({ unique: true, nullable: true })
  imei: string;

  @Column({
    type: 'enum',
    enum: ['new', 'used', 'refurbished'],
    default: 'used',
  })
  condition: string;

  @Column({ nullable: true })
  storage: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  model: string;

  @Column({ type: 'int', nullable: true })
  batteryHealth: number;

  @Column({
    type: 'enum',
    enum: ['available', 'sold', 'pending'],
    default: 'available',
  })
  status: string;

  // Foreign keys
  @Column({ name: 'categoryId' })
  categoryId: number;

  @Column({ name: 'createdBy' })
  createdBy: number;

  // Relationships
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
