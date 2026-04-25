import { eq } from 'drizzle-orm';

import { prices, products } from '../../src/lib/server/db/schema';
import { getStripe } from '../../src/lib/server/stripe/client';
import { closeSeedDbConnection, seedDb } from './db';

async function main(): Promise<void> {
  const stripe = getStripe();
  const rows = await seedDb
    .select({
      productId: products.id,
      name: products.name,
      slug: products.slug,
      stripeProductId: products.stripeProductId,
      priceId: prices.id,
      amountCents: prices.amountCents,
      currency: prices.currency,
      stripePriceId: prices.stripePriceId,
    })
    .from(products)
    .innerJoin(prices, eq(products.id, prices.productId))
    .where(eq(prices.isActive, true));

  for (const row of rows) {
    const stripeProduct =
      row.stripeProductId ??
      (
        await stripe.products.create(
          {
            name: row.name,
            metadata: { product_id: row.productId, slug: row.slug },
          },
          { idempotencyKey: `product:${row.productId}` },
        )
      ).id;

    if (!row.stripeProductId) {
      await seedDb
        .update(products)
        .set({ stripeProductId: stripeProduct })
        .where(eq(products.id, row.productId));
    }

    if (!row.stripePriceId) {
      const stripePrice = await stripe.prices.create(
        {
          product: stripeProduct,
          unit_amount: row.amountCents,
          currency: row.currency,
          metadata: { price_id: row.priceId, product_id: row.productId },
        },
        { idempotencyKey: `price:${row.priceId}` },
      );

      await seedDb
        .update(prices)
        .set({ stripePriceId: stripePrice.id })
        .where(eq(prices.id, row.priceId));
    }
  }
}

try {
  await main();
} finally {
  await closeSeedDbConnection();
}
