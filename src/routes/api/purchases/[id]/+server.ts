import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

import { requireUser } from '$lib/server/auth/guards';
import { db } from '$lib/server/db';
import { products, purchases } from '$lib/server/db/schema';
import { NotFoundError } from '$lib/server/errors';
import { handleApiError } from '$lib/server/http';

export async function GET(event: RequestEvent): Promise<Response> {
  try {
    const user = requireUser(event);
    const [purchase] = await db
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
      .where(and(eq(purchases.id, event.params.id), eq(purchases.userId, user.id)))
      .limit(1);

    if (!purchase) {
      throw new NotFoundError('Purchase not found.');
    }

    return json({ purchase });
  } catch (error) {
    return handleApiError(error);
  }
}
