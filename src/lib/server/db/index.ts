import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '$env/dynamic/private';

import * as schema from './schema';

const databaseUrl = env.DATABASE_URL ?? 'postgres://user:password@localhost:5432/trading_store';

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
