import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { users } from './auth';
import { prices, products } from './products';
import { createdAt } from './shared';

export const purchaseStatus = pgEnum('purchase_status', ['completed', 'refunded', 'disputed']);

export const purchases = pgTable(
  'purchases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    priceId: uuid('price_id')
      .notNull()
      .references(() => prices.id, { onDelete: 'restrict' }),
    amountPaidCents: integer('amount_paid_cents').notNull(),
    currency: text('currency').notNull(),
    stripeCheckoutSessionId: text('stripe_checkout_session_id').notNull(),
    stripePaymentIntentId: text('stripe_payment_intent_id').notNull(),
    stripeReceiptUrl: text('stripe_receipt_url'),
    status: purchaseStatus('status').notNull(),
    purchasedAt: timestamp('purchased_at', { withTimezone: true }).notNull(),
    refundedAt: timestamp('refunded_at', { withTimezone: true }),
    createdAt,
  },
  (table) => [
    uniqueIndex('purchases_checkout_session_unique').on(table.stripeCheckoutSessionId),
    uniqueIndex('purchases_payment_intent_unique').on(table.stripePaymentIntentId),
    index('purchases_user_id_idx').on(table.userId),
    index('purchases_product_id_idx').on(table.productId),
    index('purchases_status_idx').on(table.status),
  ],
);

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [purchases.productId],
    references: [products.id],
  }),
  price: one(prices, {
    fields: [purchases.priceId],
    references: [prices.id],
  }),
}));
