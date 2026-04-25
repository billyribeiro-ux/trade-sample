import { json } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

import { requireUser } from '$lib/server/auth/guards';
import { db } from '$lib/server/db';
import { products, purchases } from '$lib/server/db/schema';
import { handleApiError } from '$lib/server/http';

export async function GET(event: RequestEvent): Promise<Response> {
  try {
    const user = requireUser(event);
    const rows = await db
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
      .where(eq(purchases.userId, user.id))
      .orderBy(desc(purchases.purchasedAt));

    return json({ purchases: rows });
  } catch (error) {
    return handleApiError(error);
  }
}
