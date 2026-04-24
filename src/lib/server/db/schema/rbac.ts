import { relations, sql } from 'drizzle-orm';
import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { users } from './auth';
import { createdAt } from './shared';

export const roles = pgTable(
  'roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt,
  },
  (table) => [uniqueIndex('roles_name_unique').on(table.name)],
);

export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt,
  },
  (table) => [uniqueIndex('permissions_name_unique').on(table.name)],
);

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
    createdAt,
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const roleAssignments = pgTable(
  'role_assignments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    assignedById: uuid('assigned_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt,
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('role_assignments_user_id_idx').on(table.userId),
    index('role_assignments_role_id_idx').on(table.roleId),
    uniqueIndex('role_assignments_active_unique')
      .on(table.userId, table.roleId)
      .where(sql`deleted_at is null`),
  ],
);

export const rolesRelations = relations(roles, ({ many }) => ({
  assignments: many(roleAssignments),
  permissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const roleAssignmentsRelations = relations(roleAssignments, ({ one }) => ({
  user: one(users, {
    fields: [roleAssignments.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [roleAssignments.roleId],
    references: [roles.id],
  }),
  assignedBy: one(users, {
    fields: [roleAssignments.assignedById],
    references: [users.id],
  }),
}));
