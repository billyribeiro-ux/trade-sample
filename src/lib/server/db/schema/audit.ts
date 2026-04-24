import { relations } from 'drizzle-orm';
import { index, inet, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { users } from './auth';
import { createdAt } from './shared';

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    resourceType: text('resource_type'),
    resourceId: uuid('resource_id'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    ipAddress: inet('ip_address'),
    createdAt,
  },
  (table) => [
    index('audit_log_actor_id_idx').on(table.actorId),
    index('audit_log_action_idx').on(table.action),
    index('audit_log_resource_idx').on(table.resourceType, table.resourceId),
  ],
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  actor: one(users, {
    fields: [auditLog.actorId],
    references: [users.id],
  }),
}));
