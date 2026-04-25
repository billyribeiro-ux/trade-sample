import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../../src/lib/server/db/schema';
import { getDatabaseUrl } from '../env';

const queryClient = postgres(getDatabaseUrl(), { prepare: false });

export const seedDb = drizzle(queryClient, { schema });

export async function closeSeedDbConnection(): Promise<void> {
  await queryClient.end();
}
