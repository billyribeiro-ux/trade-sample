import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { prices, products } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => ({
  products: await db
    .select({
      slug: products.slug,
      name: products.name,
      isActive: products.isActive,
      amountCents: prices.amountCents,
      downloadPolicy: products.downloadPolicy,
    })
    .from(products)
    .innerJoin(prices, eq(products.id, prices.productId))
    .orderBy(desc(products.createdAt)),
});
