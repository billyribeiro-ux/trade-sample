import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { db } from '$lib/server/db';
import { auditLog, purchases } from '$lib/server/db/schema';
import { NotFoundError, ValidationError } from '$lib/server/errors';
import { handleApiError } from '$lib/server/http';
import { getStripe } from '$lib/server/stripe/client';

export async function POST(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'purchase.refund');
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.id, event.params.id))
      .limit(1);

    if (!purchase) {
      throw new NotFoundError('Purchase not found.');
    }

    if (purchase.status !== 'completed') {
      throw new ValidationError('Only completed purchases can be refunded.');
    }

    const refund = await getStripe().refunds.create(
      {
        payment_intent: purchase.stripePaymentIntentId,
      },
      {
        idempotencyKey: `refund:${purchase.id}`,
      },
    );

    await db.insert(auditLog).values({
      actorId: event.locals.user?.id,
      action: 'purchase.refund_requested',
      resourceType: 'purchase',
      resourceId: purchase.id,
      metadata: { refundId: refund.id },
    });

    return json({ refundId: refund.id });
  } catch (error) {
    return handleApiError(error);
  }
}
