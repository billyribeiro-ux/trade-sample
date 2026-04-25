import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { auditLog } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => ({
  events: await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(100),
});
