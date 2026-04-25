import { and, desc, eq, isNull } from 'drizzle-orm';

import { assertDatabaseConfigured, db } from '$lib/server/db';
import { prices, products } from '$lib/server/db/schema';
import { NotFoundError } from '$lib/server/errors';

export async function listActiveProducts() {
  assertDatabaseConfigured();

  return db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      coverImageBlobPathname: products.coverImageBlobPathname,
      fileBlobPathname: products.fileBlobPathname,
      downloadPolicy: products.downloadPolicy,
      downloadLimit: products.downloadLimit,
      amountCents: prices.amountCents,
      currency: prices.currency,
      stripePriceId: prices.stripePriceId,
    })
    .from(products)
    .innerJoin(prices, eq(products.id, prices.productId))
    .where(and(eq(products.isActive, true), isNull(products.deletedAt), eq(prices.isActive, true)))
    .orderBy(desc(products.createdAt));
}

export async function getActiveProductBySlug(slug: string) {
  assertDatabaseConfigured();

  const [product] = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      coverImageBlobPathname: products.coverImageBlobPathname,
      fileBlobPathname: products.fileBlobPathname,
      downloadPolicy: products.downloadPolicy,
      downloadLimit: products.downloadLimit,
      amountCents: prices.amountCents,
      currency: prices.currency,
      priceId: prices.id,
      stripePriceId: prices.stripePriceId,
    })
    .from(products)
    .innerJoin(prices, eq(products.id, prices.productId))
    .where(
      and(
        eq(products.slug, slug),
        eq(products.isActive, true),
        isNull(products.deletedAt),
        eq(prices.isActive, true),
      ),
    )
    .limit(1);

  if (!product) {
    throw new NotFoundError('Product not found.');
  }

  return product;
}
