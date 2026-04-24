import { relations } from 'drizzle-orm';
import { index, inet, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './auth';
import { entitlements } from './entitlements';
import { products } from './products';
import { createdAt } from './shared';

export const downloadLog = pgTable(
  'download_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    entitlementId: uuid('entitlement_id')
      .notNull()
      .references(() => entitlements.id, { onDelete: 'restrict' }),
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    signedUrlExpiresAt: timestamp('signed_url_expires_at', { withTimezone: true }).notNull(),
    createdAt,
  },
  (table) => [
    index('download_log_user_id_idx').on(table.userId),
    index('download_log_product_id_idx').on(table.productId),
    index('download_log_entitlement_id_idx').on(table.entitlementId),
  ],
);

export const downloadLogRelations = relations(downloadLog, ({ one }) => ({
  user: one(users, {
    fields: [downloadLog.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [downloadLog.productId],
    references: [products.id],
  }),
  entitlement: one(entitlements, {
    fields: [downloadLog.entitlementId],
    references: [entitlements.id],
  }),
}));
