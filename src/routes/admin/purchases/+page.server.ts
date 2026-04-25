import { and, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { products, purchases, users } from '$lib/server/db/schema';

const purchaseStatuses = ['completed', 'refunded', 'disputed'] as const;

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const status = url.searchParams.get('status') ?? '';
  const conditions: SQL[] = [];

  if (query) {
    const searchCondition = or(ilike(users.email, `%${query}%`), ilike(products.name, `%${query}%`));

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  if (purchaseStatuses.some((value) => value === status)) {
    conditions.push(eq(purchases.status, status as (typeof purchaseStatuses)[number]));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const [summary] = await db
    .select({
      totalCount: sql<number>`count(*)`,
      completedCount: sql<number>`count(*) filter (where ${purchases.status} = 'completed')`,
      refundedCount: sql<number>`count(*) filter (where ${purchases.status} = 'refunded')`,
      disputedCount: sql<number>`count(*) filter (where ${purchases.status} = 'disputed')`,
      revenueCents: sql<number>`coalesce(sum(${purchases.amountPaidCents}) filter (where ${purchases.status} = 'completed'), 0)`,
    })
    .from(purchases)
    .innerJoin(users, eq(purchases.userId, users.id))
    .innerJoin(products, eq(purchases.productId, products.id))
    .where(whereClause);

  return {
    filters: { query, status },
    purchaseStatuses,
    summary: summary ?? {
      totalCount: 0,
      completedCount: 0,
      refundedCount: 0,
      disputedCount: 0,
      revenueCents: 0,
    },
    purchases: await db
      .select({
        id: purchases.id,
        customerEmail: users.email,
        productName: products.name,
        amountPaidCents: purchases.amountPaidCents,
        currency: purchases.currency,
        status: purchases.status,
        receiptUrl: purchases.stripeReceiptUrl,
        stripePaymentIntentId: purchases.stripePaymentIntentId,
        purchasedAt: purchases.purchasedAt,
        refundedAt: purchases.refundedAt,
      })
      .from(purchases)
      .innerJoin(users, eq(purchases.userId, users.id))
      .innerJoin(products, eq(purchases.productId, products.id))
      .where(whereClause)
      .orderBy(desc(purchases.purchasedAt))
      .limit(100),
  };
};
