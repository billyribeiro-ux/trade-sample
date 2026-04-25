import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { products, purchases, users } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => ({
  purchases: await db
    .select({
      id: purchases.id,
      customerEmail: users.email,
      productName: products.name,
      amountPaidCents: purchases.amountPaidCents,
      currency: purchases.currency,
      status: purchases.status,
      purchasedAt: purchases.purchasedAt,
    })
    .from(purchases)
    .innerJoin(users, eq(purchases.userId, users.id))
    .innerJoin(products, eq(purchases.productId, products.id))
    .orderBy(desc(purchases.purchasedAt)),
});
