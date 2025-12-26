import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscribers')
export class Subscriber {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: true })
  isSubscribed!: boolean;

  @Column({ unique: true })
  unsubscribeToken!: string;

  @CreateDateColumn()
  subscribedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
