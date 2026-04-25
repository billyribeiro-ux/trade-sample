import { sql } from 'drizzle-orm';

import { closeSeedDbConnection, seedDb } from './db';

const tables = [
  'audit_log',
  'download_log',
  'webhook_events',
  'entitlements',
  'purchases',
  'role_permissions',
  'role_assignments',
  'permissions',
  'roles',
  'prices',
  'products',
  'accounts',
  'sessions',
  'verifications',
  'users',
];

export async function resetDatabase(): Promise<void> {
  await seedDb.execute(sql.raw(`truncate table ${tables.join(', ')} restart identity cascade`));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await resetDatabase();
  } finally {
    await closeSeedDbConnection();
  }
}
