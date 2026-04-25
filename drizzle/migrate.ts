import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import * as schema from '../src/lib/server/db/schema';
import { getDatabaseUrl } from './env';

const queryClient = postgres(getDatabaseUrl(), { max: 1, prepare: false });
const migrationDb = drizzle(queryClient, { schema });

try {
  await migrate(migrationDb, { migrationsFolder: 'drizzle/migrations' });
  console.log('Database migrations applied.');
} finally {
  await queryClient.end();
}
