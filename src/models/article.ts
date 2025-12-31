/* eslint-disable regexp/no-obscure-range */
import 'reflect-metadata';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ArticleType = 'news' | 'article';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  image!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  html!: string;

  @Column({ type: 'text', nullable: true })
  sanitizedHtml!: string;

  @Column({ type: 'varchar', length: 20, default: 'article' })
  type!: ArticleType;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  @Index()
  slug!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle?: string;

  @Column({ type: 'text', nullable: true })
  metaDescription?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  metaKeywords?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author?: string;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'int', default: 0 })
  viewCount!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug && this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^а-яёa-z0-9]+/gi, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 255);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  setPublishedDate() {
    if (this.isActive && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  }
}
