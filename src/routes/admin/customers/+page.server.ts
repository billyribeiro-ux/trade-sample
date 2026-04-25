import { count, desc, eq, sql, sum } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { db } from '$lib/server/db';
import { purchases, users } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
  await requirePermission(event, 'purchase.read.all');

  return {
    customers: await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        purchaseCount: count(purchases.id),
        totalSpentCents: sql<number>`coalesce(${sum(purchases.amountPaidCents)}, 0)`,
        lastPurchaseAt: sql<Date | null>`max(${purchases.purchasedAt})`,
      })
      .from(users)
      .leftJoin(purchases, eq(users.id, purchases.userId))
      .groupBy(users.id)
      .orderBy(desc(users.createdAt)),
  };
};
