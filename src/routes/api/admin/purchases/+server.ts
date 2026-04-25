import { json } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { db } from '$lib/server/db';
import { products, purchases, users } from '$lib/server/db/schema';
import { handleApiError } from '$lib/server/http';

export async function GET(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'purchase.read.all');
    const rows = await db
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
      .orderBy(desc(purchases.purchasedAt));

    return json({ purchases: rows });
  } catch (error) {
    return handleApiError(error);
  }
}
