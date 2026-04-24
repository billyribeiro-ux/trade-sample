import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createdAt } from './shared';

export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt,
});
