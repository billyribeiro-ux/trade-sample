import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '$env/dynamic/private';

import { ConfigurationError } from '$lib/server/errors';
import * as schema from './schema';

const databaseUrl = env.DATABASE_URL ?? 'postgres://user:password@localhost:5432/trading_store';

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });

export type Database = typeof db;

export function assertDatabaseConfigured(): void {
  if (!env.DATABASE_URL) {
    throw new ConfigurationError(
      'DATABASE_URL is required before the storefront can load products, purchases, and entitlements.',
    );
  }
}
