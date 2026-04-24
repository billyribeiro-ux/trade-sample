import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { existsSync, readFileSync } from 'node:fs';

import * as schema from '../../src/lib/server/db/schema';

function loadLocalEnv(): void {
  if (!existsSync('.env')) {
    return;
  }

  const lines = readFileSync('.env', 'utf8').split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1).replace(/^"|"$/g, '');

    process.env[key] ??= value;
  }
}

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Add it to .env before running seed scripts.');
}

const sql = neon(databaseUrl);

export const seedDb = drizzle(sql, { schema });
