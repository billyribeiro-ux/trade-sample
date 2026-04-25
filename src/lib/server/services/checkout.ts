import { env as publicEnv } from '$env/dynamic/public';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { AuthenticationError, ValidationError } from '$lib/server/errors';
import { getActiveProductBySlug } from '$lib/server/services/products';
import { getStripe } from '$lib/server/stripe/client';

function getAppUrl(): string {
  return publicEnv.PUBLIC_APP_URL || 'http://localhost:5173';
}

export async function createCheckoutSession(event: RequestEvent, slug: string): Promise<string> {
  const user = event.locals.user;

  if (!user) {
    throw new AuthenticationError('Sign in is required before checkout.');
  }

  const product = await getActiveProductBySlug(slug);
  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  if (!dbUser) {
    throw new ValidationError('User not found.');
  }

  if (!product.stripePriceId) {
    throw new ValidationError('Product is not synced to Stripe yet. Run pnpm stripe:sync.');
  }

  const stripe = getStripe();
  let stripeCustomerId = dbUser.stripeCustomerId ?? null;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create(
      {
        email: user.email,
        ...(user.name ? { name: user.name } : {}),
        metadata: {
          user_id: user.id,
        },
      },
      {
        idempotencyKey: `customer:${user.id}`,
      },
    );

    stripeCustomerId = customer.id;
    await db.update(users).set({ stripeCustomerId }).where(eq(users.id, user.id));
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      customer: stripeCustomerId,
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      success_url: `${getAppUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getAppUrl()}/checkout/cancel`,
      metadata: {
        user_id: user.id,
        product_id: product.id,
        price_id: product.priceId,
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
          product_id: product.id,
          price_id: product.priceId,
        },
      },
    },
    {
      idempotencyKey: `checkout:${user.id}:${product.id}:${Date.now()}`,
    },
  );

  if (!session.url) {
    throw new ValidationError('Stripe did not return a checkout URL.');
  }

  return session.url;
}
