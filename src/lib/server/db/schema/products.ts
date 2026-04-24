import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { createdAt, updatedAt } from './shared';

export const downloadPolicy = pgEnum('download_policy', ['unlimited', 'capped']);

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    coverImageBlobPathname: text('cover_image_blob_pathname'),
    fileBlobPathname: text('file_blob_pathname').notNull(),
    downloadPolicy: downloadPolicy('download_policy').notNull(),
    downloadLimit: integer('download_limit'),
    isActive: boolean('is_active').notNull().default(true),
    stripeProductId: text('stripe_product_id'),
    createdAt,
    updatedAt,
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('products_slug_unique').on(table.slug),
    index('products_is_active_idx').on(table.isActive),
  ],
);

export const prices = pgTable(
  'prices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('usd'),
    stripePriceId: text('stripe_price_id'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt,
  },
  (table) => [
    index('prices_product_id_idx').on(table.productId),
    index('prices_is_active_idx').on(table.isActive),
  ],
);

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}));

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
}));
