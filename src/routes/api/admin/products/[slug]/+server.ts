import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import * as v from 'valibot';
import type { RequestEvent } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { db } from '$lib/server/db';
import { auditLog, prices, products } from '$lib/server/db/schema';
import { NotFoundError } from '$lib/server/errors';
import { handleApiError } from '$lib/server/http';
import { getActiveProductBySlug } from '$lib/server/services/products';
import { productPayloadSchema } from '$lib/schemas/product';

export async function GET(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'product.read');
    return json({ product: await getActiveProductBySlug(event.params.slug) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'product.update');
    const payload = v.parse(productPayloadSchema, await event.request.json());
    const existing = await getActiveProductBySlug(event.params.slug);

    const [product] = await db
      .update(products)
      .set({
        slug: payload.slug,
        name: payload.name,
        description: payload.description ?? null,
        downloadPolicy: payload.downloadPolicy,
        downloadLimit: payload.downloadPolicy === 'capped' ? (payload.downloadLimit ?? 3) : null,
        isActive: payload.isActive,
        updatedAt: new Date(),
      })
      .where(eq(products.id, existing.id))
      .returning();

    if (!product) {
      throw new NotFoundError('Product not found.');
    }

    if (existing.amountCents !== payload.amountCents) {
      await db.update(prices).set({ isActive: false }).where(eq(prices.productId, existing.id));
      await db.insert(prices).values({
        productId: existing.id,
        amountCents: payload.amountCents,
        currency: 'usd',
        isActive: true,
      });
    }

    await db.insert(auditLog).values({
      actorId: event.locals.user?.id,
      action: 'product.updated',
      resourceType: 'product',
      resourceId: existing.id,
      metadata: { slug: payload.slug },
    });

    return json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'product.delete');
    const [product] = await db
      .update(products)
      .set({ isActive: false, deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(products.slug, event.params.slug), eq(products.isActive, true)))
      .returning();

    if (!product) {
      throw new NotFoundError('Product not found.');
    }

    await db.insert(auditLog).values({
      actorId: event.locals.user?.id,
      action: 'product.deleted',
      resourceType: 'product',
      resourceId: product.id,
      metadata: { slug: event.params.slug },
    });

    return json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}
