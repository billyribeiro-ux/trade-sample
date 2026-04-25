import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { products, purchases } from '$lib/server/db/schema';
import { getStripe } from '$lib/server/stripe/client';

export const load: PageServerLoad = async ({ url }) => {
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return {
      state: 'missing_session' as const,
      bookTitle: null,
      receiptUrl: null,
    };
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    return {
      state: 'unpaid' as const,
      bookTitle: null,
      receiptUrl: null,
    };
  }

  const [purchase] = await db
    .select({
      id: purchases.id,
      status: purchases.status,
      stripeReceiptUrl: purchases.stripeReceiptUrl,
      productName: products.name,
    })
    .from(purchases)
    .innerJoin(products, eq(purchases.productId, products.id))
    .where(eq(purchases.stripeCheckoutSessionId, sessionId))
    .limit(1);

  if (!purchase || purchase.status !== 'completed') {
    return {
      state: 'processing' as const,
      bookTitle: null,
      receiptUrl: null,
    };
  }

  return {
    state: 'ready' as const,
    bookTitle: purchase.productName,
    receiptUrl: purchase.stripeReceiptUrl,
  };
};
