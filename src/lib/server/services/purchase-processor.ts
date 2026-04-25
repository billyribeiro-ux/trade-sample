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
import { getStripe } from '$lib/server/stripe/client';

function requireString(value: string | null | undefined, label: string): string {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

async function getReceiptUrl(paymentIntentId: string): Promise<string | null> {
  const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId, {
    expand: ['latest_charge'],
  });
  const charge = paymentIntent.latest_charge;

  if (typeof charge === 'object' && charge?.receipt_url) {
    return charge.receipt_url;
  }

  return null;
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

  const receiptUrl = await getReceiptUrl(paymentIntentId);
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
      stripeReceiptUrl: receiptUrl,
      status: 'completed',
      purchasedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: purchases.stripeCheckoutSessionId,
      set: {
        status: 'completed',
        stripeReceiptUrl: receiptUrl,
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
      receiptUrl,
    }),
  });
}

export async function processPaymentIntentFailed(
  eventId: string,
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  await db.insert(auditLog).values({
    actorId: paymentIntent.metadata.user_id || null,
    action: 'purchase.payment_failed',
    resourceType: 'product',
    resourceId: paymentIntent.metadata.product_id || null,
    metadata: {
      paymentIntentId: paymentIntent.id,
      failureCode: paymentIntent.last_payment_error?.code ?? null,
      failureMessage: paymentIntent.last_payment_error?.message ?? null,
    },
  });

  await markWebhookProcessed(eventId);
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

    await db.insert(auditLog).values({
      actorId: purchase.userId,
      action: 'purchase.refunded',
      resourceType: 'purchase',
      resourceId: purchase.id,
      metadata: {
        paymentIntentId,
        chargeId: charge.id,
      },
    });

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

export async function processDisputeCreated(
  eventId: string,
  dispute: Stripe.Dispute,
): Promise<void> {
  const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id;
  const charge =
    typeof dispute.charge === 'string' ? await getStripe().charges.retrieve(chargeId) : dispute.charge;
  const paymentIntentId =
    typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;

  if (!paymentIntentId) {
    await markWebhookProcessed(eventId);
    return;
  }

  const [purchase] = await db
    .update(purchases)
    .set({ status: 'disputed' })
    .where(eq(purchases.stripePaymentIntentId, paymentIntentId))
    .returning();

  if (purchase) {
    await db
      .update(entitlements)
      .set({ revokedAt: new Date() })
      .where(and(eq(entitlements.purchaseId, purchase.id), isNull(entitlements.revokedAt)));

    await db.insert(auditLog).values({
      actorId: purchase.userId,
      action: 'purchase.disputed',
      resourceType: 'purchase',
      resourceId: purchase.id,
      metadata: {
        paymentIntentId,
        chargeId,
        disputeId: dispute.id,
        reason: dispute.reason,
      },
    });
  }

  await markWebhookProcessed(eventId);
}
