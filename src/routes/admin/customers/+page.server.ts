import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => ({
  customers: await db.select().from(users).orderBy(desc(users.createdAt)),
});
