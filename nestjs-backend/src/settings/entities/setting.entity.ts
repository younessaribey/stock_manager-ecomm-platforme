/**
 * STEP 1: Setting Entity
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  siteName: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ type: 'int', nullable: true })
  itemsPerPage: number;

  @Column({ type: 'int', nullable: true })
  lowStockThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
