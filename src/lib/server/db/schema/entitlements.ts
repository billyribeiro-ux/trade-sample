import { relations, sql } from 'drizzle-orm';
import { index, integer, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { users } from './auth';
import { products } from './products';
import { purchases } from './purchases';

export const entitlements = pgTable(
  'entitlements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    purchaseId: uuid('purchase_id').references(() => purchases.id, { onDelete: 'set null' }),
    grantedAt: timestamp('granted_at', { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    downloadsAllowed: integer('downloads_allowed'),
    downloadsUsed: integer('downloads_used').notNull().default(0),
  },
  (table) => [
    index('entitlements_user_id_idx').on(table.userId),
    index('entitlements_product_id_idx').on(table.productId),
    uniqueIndex('entitlements_active_user_product_unique')
      .on(table.userId, table.productId)
      .where(sql`revoked_at is null`),
  ],
);

export const entitlementsRelations = relations(entitlements, ({ one }) => ({
  user: one(users, {
    fields: [entitlements.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [entitlements.productId],
    references: [products.id],
  }),
  purchase: one(purchases, {
    fields: [entitlements.purchaseId],
    references: [purchases.id],
  }),
}));
