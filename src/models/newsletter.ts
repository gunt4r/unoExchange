import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NewsletterStatus } from '@/enums/newsletter.enum';

@Entity('newsletters')
export class Newsletter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  subject!: string;

  @Column('text')
  content!: string;

  @Column('text', { nullable: true })
  htmlContent!: string;

  @Column({ default: 0 })
  recipientsCount!: number;

  @Column({ type: 'enum', enum: NewsletterStatus, default: NewsletterStatus.DRAFT })
  status!: NewsletterStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  sentAt!: Date;
}
