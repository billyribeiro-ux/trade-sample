import { env } from '$env/dynamic/private';
import type { RequestEvent } from './$types';

import {
  processChargeRefunded,
  processCheckoutCompleted,
  recordWebhookEvent,
} from '$lib/server/services/purchase-processor';
import { getStripe } from '$lib/server/stripe/client';

export async function POST(event: RequestEvent): Promise<Response> {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new Response('STRIPE_WEBHOOK_SECRET is required.', { status: 500 });
  }

  const signature = event.request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing Stripe signature.', { status: 400 });
  }

  const body = await event.request.text();
  const stripe = getStripe();
  const stripeEvent = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  const shouldProcess = await recordWebhookEvent(stripeEvent);

  if (!shouldProcess) {
    return new Response('ok');
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    await processCheckoutCompleted(stripeEvent.id, stripeEvent.data.object);
  } else if (stripeEvent.type === 'charge.refunded') {
    await processChargeRefunded(stripeEvent.id, stripeEvent.data.object);
  }

  return new Response('ok');
}
