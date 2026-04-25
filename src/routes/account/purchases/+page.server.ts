import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { products, purchases } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    return { purchases: [] };
  }

  return {
    purchases: await db
      .select({
        id: purchases.id,
        productName: products.name,
        amountPaidCents: purchases.amountPaidCents,
        currency: purchases.currency,
        status: purchases.status,
        receiptUrl: purchases.stripeReceiptUrl,
        purchasedAt: purchases.purchasedAt,
      })
      .from(purchases)
      .innerJoin(products, eq(purchases.productId, products.id))
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.purchasedAt)),
  };
};
