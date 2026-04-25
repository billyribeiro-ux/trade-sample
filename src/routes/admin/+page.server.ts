import { desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { auditLog, products, purchases, users } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
  const [revenue] = await db
    .select({ total: sql<number>`coalesce(sum(${purchases.amountPaidCents}), 0)` })
    .from(purchases)
    .where(eq(purchases.status, 'completed'));

  return {
    revenueCents: revenue?.total ?? 0,
    purchases: await db
      .select({
        id: purchases.id,
        customerEmail: users.email,
        productName: products.name,
        amountPaidCents: purchases.amountPaidCents,
        status: purchases.status,
        purchasedAt: purchases.purchasedAt,
      })
      .from(purchases)
      .innerJoin(users, eq(purchases.userId, users.id))
      .innerJoin(products, eq(purchases.productId, products.id))
      .orderBy(desc(purchases.purchasedAt))
      .limit(20),
    activity: await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(20),
  };
};
