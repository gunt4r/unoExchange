// src/config/database.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Currency } from '@/models/currency';

const DB_USER = process.env.DATABASE_USER || 'postgres';
const DB_PASSWORD = process.env.DATABASE_PASSWORD || 'postgres';
const DB_HOST = process.env.DATABASE_HOST || 'localhost';
const DB_PORT = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432;
const DB_NAME = process.env.DATABASE_NAME || 'unoexchange';
console.log('DB_HOST', DB_HOST, 'DB_USER', DB_USER, 'DB_PASSWORD', DB_PASSWORD, 'DB_NAME', DB_NAME);

// Расширяем тип globalThis для TypeScript
declare global {
  var _typeormDataSource: DataSource | undefined;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: process.env.NODE_ENV === 'development', // автосоздание таблиц в dev
  logging: process.env.NODE_ENV === 'development',
  entities: [Currency], // добавляйте сюда новые сущности
  subscribers: [],
  migrations: [],
});

// Инициализация подключения (для hot reload в Next.js)
let dataSourcePromise: Promise<DataSource>;

if (process.env.NODE_ENV === 'production') {
  dataSourcePromise = AppDataSource.initialize();
} else {
  if (!global._typeormDataSource) {
    global._typeormDataSource = AppDataSource;
  }
  
  if (!global._typeormDataSource.isInitialized) {
    dataSourcePromise = global._typeormDataSource.initialize();
  } else {
    dataSourcePromise = Promise.resolve(global._typeormDataSource);
  }
}

// Функция для получения инициализированного DataSource
export const getDataSource = async (): Promise<DataSource> => {
  return dataSourcePromise;
};

// Экспорт для использования в сервисах
export default AppDataSource;