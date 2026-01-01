import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableIndex } from 'typeorm';

export class InitSchema1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==========================
    // Таблица admins
    // ==========================
    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'username', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    // ==========================
    // Таблица articles
    // ==========================
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'image', type: 'varchar', length: '255' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'html', type: 'text', isNullable: true },
          { name: 'sanitizedHtml', type: 'text', isNullable: true },
          { name: 'type', type: 'varchar', length: '20', default: '\'article\'' },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'slug', type: 'varchar', length: '255', isUnique: true, isNullable: true },
          { name: 'metaTitle', type: 'varchar', length: '255', isNullable: true },
          { name: 'metaDescription', type: 'text', isNullable: true },
          { name: 'metaKeywords', type: 'varchar', length: '500', isNullable: true },
          { name: 'author', type: 'varchar', length: '255', isNullable: true },
          { name: 'publishedAt', type: 'timestamptz', isNullable: true },
          { name: 'tags', type: 'text', isArray: true, isNullable: true },
          { name: 'viewCount', type: 'int', default: 0 },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createIndex('articles', new TableIndex({ columnNames: ['slug'] }));

    // ==========================
    // Таблица newsletters
    // ==========================
    await queryRunner.createTable(
      new Table({
        name: 'newsletters',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'subject', type: 'varchar' },
          { name: 'content', type: 'text' },
          { name: 'htmlContent', type: 'text', isNullable: true },
          { name: 'recipientsCount', type: 'int', default: 0 },
          { name: 'status', type: 'enum', enum: ['DRAFT', 'SENT'], default: '\'DRAFT\'' },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'sentAt', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    // ==========================
    // Таблица currencies
    // ==========================
    await queryRunner.createTable(
      new Table({
        name: 'currencies',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'code', type: 'varchar', length: '10', isUnique: true },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'rateToZL', type: 'decimal', precision: 12, scale: 6, default: 1 },
          { name: 'imageUrl', type: 'varchar', length: '255', isNullable: true },
          { name: 'reserve', type: 'decimal', precision: 15, scale: 2, isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'isBase', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    // ==========================
    // Таблица subscribers
    // ==========================
    await queryRunner.createTable(
      new Table({
        name: 'subscribers',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'isSubscribed', type: 'boolean', default: true },
          { name: 'unsubscribeToken', type: 'varchar', isUnique: true },
          { name: 'subscribedAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscribers');
    await queryRunner.dropTable('currencies');
    await queryRunner.dropTable('newsletters');
    await queryRunner.dropTable('articles');
    await queryRunner.dropTable('admins');
  }
}
