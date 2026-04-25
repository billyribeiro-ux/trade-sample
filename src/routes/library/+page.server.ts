import { and, eq, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { entitlements, products, purchases } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    return { books: [] };
  }

  const books = await db
    .select({
      slug: products.slug,
      name: products.name,
      description: products.description,
      downloadPolicy: products.downloadPolicy,
      downloadsAllowed: entitlements.downloadsAllowed,
      downloadsUsed: entitlements.downloadsUsed,
      purchasedAt: purchases.purchasedAt,
      receiptUrl: purchases.stripeReceiptUrl,
    })
    .from(entitlements)
    .innerJoin(products, eq(entitlements.productId, products.id))
    .leftJoin(purchases, eq(entitlements.purchaseId, purchases.id))
    .where(and(eq(entitlements.userId, userId), isNull(entitlements.revokedAt)));

  return { books };
};
