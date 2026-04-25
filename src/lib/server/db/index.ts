import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

import * as schema from './schema';

const localDatabaseUrl = 'postgres://trading_store:trading_store@127.0.0.1:55432/trading_store';
const databaseUrl = env.DATABASE_URL ?? localDatabaseUrl;

const queryClient = postgres(databaseUrl, { prepare: false });

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;

export function assertDatabaseConfigured(): void {
  if (!databaseUrl) {
    throw new Error('Database URL is not configured.');
  }
}
