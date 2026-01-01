/* eslint-disable no-restricted-globals */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import 'reflect-metadata';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { DataSource } from 'typeorm';
import { Admin } from '../models/admin';
import { Article } from '../models/article';
import { Currency } from '../models/currency';
import { Newsletter } from '../models/newsletter';
import { Subscriber } from '../models/subscriber';

declare global {
  var __UNOEXCHANGE_DS__: DataSource | undefined;
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
    host: PGHOST,
    port: PGPORT,
    username: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    entities,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  });
}

export async function getDataSource(): Promise<DataSource> {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    throw new Error('❌ Database access during Next.js build phase');
  }

  if (global.__UNOEXCHANGE_DS__?.isInitialized) {
    return global.__UNOEXCHANGE_DS__;
  }

  if (!global.__UNOEXCHANGE_DS__) {
    global.__UNOEXCHANGE_DS__ = createDataSource();
  }

  const ds = global.__UNOEXCHANGE_DS__;

  if (ds.isInitialized) {
    return ds;
  }

  const maxAttempts = Number(process.env.DB_MAX_ATTEMPTS || 5);
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      console.log(`🔄 DB connection attempt #${attempt}...`);
      await ds.initialize();
      console.log('✅ Database connected successfully');
      return ds;
    } catch (error) {
      console.error(`❌ DB init attempt #${attempt} failed:`, error);
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error('❌ DB connection failed after max attempts');
}
