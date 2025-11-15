/**
 * STEP 1: Category Entity
 *
 * Shows self-referencing relationship (parent/child categories)
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
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, name: 'parentId' })
  parentId: number;

  @Column({ default: 0 }) // 0 = main category, 1 = subcategory
  level: number;

  @Column({ default: true })
  isActive: boolean;

  // Self-referencing relationship (parent category)
  @ManyToOne(() => Category, (category) => category.subcategories)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  // Self-referencing relationship (child categories)
  @OneToMany(() => Category, (category) => category.parent)
  subcategories: Category[];

  // One category has many products
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
