import { env } from '$env/dynamic/private';
import Stripe from 'stripe';

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required.');
  }

  client ??= new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: {
      name: 'The Trading Store',
    },
  });

  return client;
}
