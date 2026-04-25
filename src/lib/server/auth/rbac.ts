import { and, eq, isNull } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { permissions, roleAssignments, rolePermissions } from '$lib/server/db/schema';
import { PermissionError } from '$lib/server/errors';

export type Permission =
  | 'admin.access'
  | 'product.read'
  | 'product.create'
  | 'product.update'
  | 'product.delete'
  | 'purchase.read.own'
  | 'purchase.read.all'
  | 'purchase.refund'
  | 'entitlement.grant'
  | 'entitlement.revoke'
  | 'download.execute'
  | 'audit.read';

export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  const rows = await db
    .select({ permission: permissions.name })
    .from(roleAssignments)
    .innerJoin(rolePermissions, eq(roleAssignments.roleId, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(
      and(
        eq(roleAssignments.userId, userId),
        isNull(roleAssignments.deletedAt),
        eq(permissions.name, permission),
      ),
    )
    .limit(1);

  return rows.length > 0;
}

export async function requirePermission(
  event: RequestEvent,
  permission: Permission,
): Promise<void> {
  const userId = event.locals.user?.id;

  if (!userId || !(await hasPermission(userId, permission))) {
    throw new PermissionError();
  }
}
