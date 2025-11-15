/**
 * STEP 1: TypeORM Entity - User Model
 *
 * This file defines the User database table structure.
 *
 * In Express/Sequelize, this was:
 *   const User = sequelize.define('User', { ... })
 *
 * In NestJS/TypeORM, we use:
 *   - @Entity() decorator to mark as database table
 *   - @Column() decorator for each field
 *   - @PrimaryGeneratedColumn() for auto-increment ID
 *   - @OneToMany() / @ManyToOne() for relationships
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('users') // Table name in database
export class User {
  @PrimaryGeneratedColumn() // Auto-incrementing primary key
  id: number;

  @Column() // Regular column
  name: string;

  @Column({ unique: true }) // Unique constraint
  email: string;

  @Column() // Password (will be hashed)
  password: string;

  @Column({ nullable: true }) // Optional field
  profilePicture: string;

  @Column({ type: 'text', nullable: true }) // Text type for long content
  bio: string;

  @Column({ default: 'user' }) // Default value
  role: string;

  @Column({ default: false }) // Boolean with default
  approved: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  profileImage: string;

  // Relationships - One user has many products
  @OneToMany(() => Product, (product) => product.createdBy)
  products: Product[];

  // One user has many orders
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // One user has many wishlist items
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  // One user has many cart items
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  // Automatic timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
