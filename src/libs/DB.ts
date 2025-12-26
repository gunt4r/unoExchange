import { DataSource } from 'typeorm';
import { Article } from '@/models/article';
import { Currency } from '@/models/currency';
import { Newsletter } from '@/models/newsletter';
import { Subscriber } from '@/models/subscriber';
import 'reflect-metadata';

declare global {
  // eslint-disable-next-line vars-on-top
  var _typeormDataSource: DataSource | undefined;
}

const DB_USER = process.env.DATABASE_USER || 'postgres';
const DB_PASSWORD = process.env.DATABASE_PASSWORD || 'postgres';
const DB_HOST = process.env.DATABASE_HOST || 'localhost';
const DB_PORT = process.env.DATABASE_PORT ? Number.parseInt(process.env.DATABASE_PORT) : 5432;
const DB_NAME = process.env.DATABASE_NAME || 'unoexchange';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Currency, Newsletter, Article, Subscriber],
  subscribers: [],
  migrations: [],
});

let dataSourcePromise: Promise<DataSource>;

if (process.env.NODE_ENV === 'production') {
  dataSourcePromise = AppDataSource.initialize();
} else {
  if (!globalThis._typeormDataSource) {
    globalThis._typeormDataSource = AppDataSource;
  }

  if (!globalThis._typeormDataSource.isInitialized) {
    dataSourcePromise = globalThis._typeormDataSource.initialize();
  } else {
    dataSourcePromise = Promise.resolve(globalThis._typeormDataSource);
  }
}

export const getDataSource = async (): Promise<DataSource> => {
  return dataSourcePromise;
};

export default AppDataSource;
