/* eslint-disable no-restricted-globals */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Admin } from '../models/admin';
import { Article } from '../models/article';
import { Currency } from '../models/currency';
import { Newsletter } from '../models/newsletter';
import { Subscriber } from '../models/subscriber';

declare global {
  let __COURSE_FISHING_DS__: any;
}

const PGUSER = process.env.DATABASE_USER || 'postgres';
const PGPASSWORD = process.env.DATABASE_PASSWORD || 'postgres';
const PGHOST = process.env.DATABASE_HOST || 'localhost';
const PGPORT = process.env.DATABASE_PORT ? Number.parseInt(process.env.DATABASE_PORT) : 5432;
const PGDATABASE = process.env.DATABASE_NAME || 'unoexchange';
function createDataSource() {
  const entities = [Currency, Subscriber, Newsletter, Article, Admin];

  if (process.env.DATABASE_URL) {
    return new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    });
  }

  return new DataSource({
    type: 'postgres',
    host: PGHOST || 'localhost',
    port: Number(PGPORT || 5432),
    username: PGUSER || 'postgres',
    password: PGPASSWORD,
    database: PGDATABASE || 'postgres',
    entities,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  });
}

export async function getDataSource(): Promise<DataSource> {
  if ((global as any).__COURSE_FISHING_DS__ && (global as any).__COURSE_FISHING_DS__.isInitialized) {
    return (global as any).__COURSE_FISHING_DS__;
  }

  if (!(global as any).__COURSE_FISHING_DS__) {
    (global as any).__COURSE_FISHING_DS__ = createDataSource();
  }

  const ds: DataSource = (global as any).__COURSE_FISHING_DS__;
  if (ds.isInitialized) {
    return ds;
  }

  const maxAttempts = Number.parseInt(process.env.DB_MAX_ATTEMPTS || '0', 10);
  let attempt = 0;

  while (true) {
    try {
      attempt++;
      await ds.initialize();
      return ds;
    } catch (err) {
      console.error(`DB init attempt #${attempt} failed:`, (err as Error).message || err);
      // если maxAttempts > 0 и достигли лимита — пробрасываем ошибку (или можно process.exit)
      if (maxAttempts > 0 && attempt >= maxAttempts) {
        throw err;
      }
      // экспоненциальный бэкофф (до 30s)
      const waitMs = Math.min(30000, 1000 * 2 ** Math.min(attempt, 6));
      await new Promise(r => setTimeout(r, waitMs));
      // и повторяем — не выходим из процесса
    }
  }
}
