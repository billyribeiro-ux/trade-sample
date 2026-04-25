import { and, eq, isNull } from 'drizzle-orm';
import type Stripe from 'stripe';

import { db } from '$lib/server/db';
import {
  auditLog,
  entitlements,
  prices,
  products,
  purchases,
  users,
  webhookEvents,
} from '$lib/server/db/schema';
import { sendEmail, getAppUrl } from '$lib/server/email';
import { purchaseConfirmationTemplate, refundIssuedTemplate } from '$lib/server/email/templates';

function requireString(value: string | null | undefined, label: string): string {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

export async function recordWebhookEvent(event: Stripe.Event): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(webhookEvents)
    .where(eq(webhookEvents.id, event.id))
    .limit(1);

  if (existing?.processedAt) {
    return false;
  }

  if (!existing) {
    await db.insert(webhookEvents).values({
      id: event.id,
      type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });
  }

  return true;
}

export async function markWebhookProcessed(eventId: string): Promise<void> {
  await db
    .update(webhookEvents)
    .set({ processedAt: new Date() })
    .where(eq(webhookEvents.id, eventId));
}

export async function processCheckoutCompleted(
  eventId: string,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const userId = requireString(session.metadata?.user_id, 'user_id');
  const productId = requireString(session.metadata?.product_id, 'product_id');
  const priceId = requireString(session.metadata?.price_id, 'price_id');
  const paymentIntentId = requireString(
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id,
    'payment_intent',
  );
  const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const [price] = await db.select().from(prices).where(eq(prices.id, priceId)).limit(1);

  if (!product || !user || !price) {
    throw new Error('Checkout metadata references missing rows.');
  }

  const [purchase] = await db
    .insert(purchases)
    .values({
      userId,
      productId,
      priceId,
      amountPaidCents: session.amount_total ?? price.amountCents,
      currency: session.currency ?? price.currency,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      status: 'completed',
      purchasedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: purchases.stripeCheckoutSessionId,
      set: {
        status: 'completed',
      },
    })
    .returning();

  await db
    .insert(entitlements)
    .values({
      userId,
      productId,
      purchaseId: purchase?.id,
      downloadsAllowed: product.downloadPolicy === 'capped' ? (product.downloadLimit ?? 3) : null,
      downloadsUsed: 0,
    })
    .onConflictDoNothing();

  await db.insert(auditLog).values({
    actorId: userId,
    action: 'purchase.completed',
    resourceType: 'purchase',
    resourceId: purchase?.id,
    metadata: {
      checkoutSessionId: session.id,
      paymentIntentId,
    },
  });

  await markWebhookProcessed(eventId);

  await sendEmail({
    to: user.email,
    ...purchaseConfirmationTemplate({
      bookTitle: product.name,
      libraryUrl: `${getAppUrl()}/library`,
      receiptUrl: null,
    }),
  });
}

export async function processChargeRefunded(eventId: string, charge: Stripe.Charge): Promise<void> {
  const paymentIntentId =
    typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;

  if (!paymentIntentId) {
    await markWebhookProcessed(eventId);
    return;
  }

  const [purchase] = await db
    .update(purchases)
    .set({ status: 'refunded', refundedAt: new Date() })
    .where(eq(purchases.stripePaymentIntentId, paymentIntentId))
    .returning();

  if (purchase) {
    await db
      .update(entitlements)
      .set({ revokedAt: new Date() })
      .where(and(eq(entitlements.purchaseId, purchase.id), isNull(entitlements.revokedAt)));

    const [user] = await db.select().from(users).where(eq(users.id, purchase.userId)).limit(1);

    if (user) {
      await sendEmail({
        to: user.email,
        ...refundIssuedTemplate(
          `${(purchase.amountPaidCents / 100).toFixed(2)} ${purchase.currency.toUpperCase()}`,
        ),
      });
    }
  }

  await markWebhookProcessed(eventId);
}
