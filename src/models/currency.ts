import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 10 })
  code!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'decimal', precision: 12, scale: 6, default: 1 })
  rateToZL!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string | null = null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  reserve: number | null = null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  isBase!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
