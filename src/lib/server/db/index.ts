import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '$env/dynamic/private';

import * as schema from './schema';

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize the database client.');
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
