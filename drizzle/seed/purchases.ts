import { entitlements, purchases } from '../../src/lib/server/db/schema';
import { seedDb } from './db';
import { seedIds } from './ids';

const purchasedAt = new Date('2026-04-24T12:00:00.000Z');

const purchaseSeeds = [
  {
    id: seedIds.purchases.customer1Book1,
    entitlementId: seedIds.entitlements.customer1Book1,
    userId: seedIds.users.customer1,
    productId: seedIds.products.book1,
    priceId: seedIds.prices.book1,
    amountPaidCents: 49_900,
    checkoutSessionId: 'cs_test_seed_customer1_book1',
    paymentIntentId: 'pi_test_seed_customer1_book1',
    downloadsAllowed: null,
  },
  {
    id: seedIds.purchases.customer2Book2,
    entitlementId: seedIds.entitlements.customer2Book2,
    userId: seedIds.users.customer2,
    productId: seedIds.products.book2,
    priceId: seedIds.prices.book2,
    amountPaidCents: 99_900,
    checkoutSessionId: 'cs_test_seed_customer2_book2',
    paymentIntentId: 'pi_test_seed_customer2_book2',
    downloadsAllowed: 3,
  },
  {
    id: seedIds.purchases.customer3Book1,
    entitlementId: seedIds.entitlements.customer3Book1,
    userId: seedIds.users.customer3,
    productId: seedIds.products.book1,
    priceId: seedIds.prices.book1,
    amountPaidCents: 49_900,
    checkoutSessionId: 'cs_test_seed_customer3_book1',
    paymentIntentId: 'pi_test_seed_customer3_book1',
    downloadsAllowed: null,
  },
  {
    id: seedIds.purchases.customer3Book2,
    entitlementId: seedIds.entitlements.customer3Book2,
    userId: seedIds.users.customer3,
    productId: seedIds.products.book2,
    priceId: seedIds.prices.book2,
    amountPaidCents: 99_900,
    checkoutSessionId: 'cs_test_seed_customer3_book2',
    paymentIntentId: 'pi_test_seed_customer3_book2',
    downloadsAllowed: 3,
  },
];

export async function seedPurchases(): Promise<void> {
  for (const purchase of purchaseSeeds) {
    await seedDb
      .insert(purchases)
      .values({
        id: purchase.id,
        userId: purchase.userId,
        productId: purchase.productId,
        priceId: purchase.priceId,
        amountPaidCents: purchase.amountPaidCents,
        currency: 'usd',
        stripeCheckoutSessionId: purchase.checkoutSessionId,
        stripePaymentIntentId: purchase.paymentIntentId,
        stripeReceiptUrl: 'https://dashboard.stripe.com/test/payments',
        status: 'completed',
        purchasedAt,
      })
      .onConflictDoNothing();

    await seedDb
      .insert(entitlements)
      .values({
        id: purchase.entitlementId,
        userId: purchase.userId,
        productId: purchase.productId,
        purchaseId: purchase.id,
        downloadsAllowed: purchase.downloadsAllowed,
        downloadsUsed: 0,
      })
      .onConflictDoNothing();
  }
}
