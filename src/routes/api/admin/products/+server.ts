import { json } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import * as v from 'valibot';
import type { RequestEvent } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { db } from '$lib/server/db';
import { prices, products } from '$lib/server/db/schema';
import { NotFoundError } from '$lib/server/errors';
import { handleApiError } from '$lib/server/http';
import { productPayloadSchema } from '$lib/schemas/product';

export async function GET(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'product.read');
    const rows = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        description: products.description,
        fileBlobPathname: products.fileBlobPathname,
        coverImageBlobPathname: products.coverImageBlobPathname,
        downloadPolicy: products.downloadPolicy,
        downloadLimit: products.downloadLimit,
        isActive: products.isActive,
        deletedAt: products.deletedAt,
        amountCents: prices.amountCents,
        currency: prices.currency,
      })
      .from(products)
      .innerJoin(prices, eq(products.id, prices.productId))
      .orderBy(desc(products.createdAt));

    return json({ products: rows });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'product.create');
    const payload = v.parse(productPayloadSchema, await event.request.json());
    const [product] = await db
      .insert(products)
      .values({
        slug: payload.slug,
        name: payload.name,
        description: payload.description ?? null,
        fileBlobPathname: `books/${payload.slug}.pdf`,
        downloadPolicy: payload.downloadPolicy,
        downloadLimit: payload.downloadPolicy === 'capped' ? (payload.downloadLimit ?? 3) : null,
        isActive: payload.isActive,
      })
      .returning();

    if (!product) {
      throw new NotFoundError('Product was not created.');
    }

    await db.insert(prices).values({
      productId: product.id,
      amountCents: payload.amountCents,
      currency: 'usd',
      isActive: true,
    });

    return json({ product }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
