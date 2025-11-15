/**
 * STEP 1: ImgBBImage Entity
 *
 * Stores metadata for images uploaded to ImgBB
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('imgbb_images')
export class ImgBBImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'general' })
  folder: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  deleteUrl: string;

  @Column({ nullable: true })
  imgbbId: string;

  @Column({ type: 'text', nullable: true }) // JSON metadata
  meta: string;

  @Column({ type: 'int', nullable: true })
  uploadedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
