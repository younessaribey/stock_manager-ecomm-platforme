import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  publishedAt: Date;
}
