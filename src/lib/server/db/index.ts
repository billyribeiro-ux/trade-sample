import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

import { ConfigurationError } from '$lib/server/errors';
import * as schema from './schema';

const databaseUrl = env.DATABASE_URL ?? 'postgres://user:password@localhost:5432/trading_store';

const queryClient = postgres(databaseUrl, { prepare: false });

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;

export function assertDatabaseConfigured(): void {
  if (!env.DATABASE_URL) {
    throw new ConfigurationError(
      'DATABASE_URL is required before the storefront can load products, purchases, and entitlements.',
    );
  }
}
