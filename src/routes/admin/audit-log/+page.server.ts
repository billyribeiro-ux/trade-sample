import { and, desc, eq, ilike, or, type SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { auditLog, users } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const resourceType = url.searchParams.get('resourceType')?.trim() ?? '';
  const conditions: SQL[] = [];

  if (query) {
    const searchCondition = or(ilike(auditLog.action, `%${query}%`), ilike(users.email, `%${query}%`));

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  if (resourceType) {
    conditions.push(eq(auditLog.resourceType, resourceType));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return {
    filters: { query, resourceType },
    resourceTypes: ['product', 'purchase', 'user', 'entitlement'],
    events: await db
      .select({
        id: auditLog.id,
        actorEmail: users.email,
        action: auditLog.action,
        resourceType: auditLog.resourceType,
        resourceId: auditLog.resourceId,
        metadata: auditLog.metadata,
        ipAddress: auditLog.ipAddress,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.actorId, users.id))
      .where(whereClause)
      .orderBy(desc(auditLog.createdAt))
      .limit(100),
  };
};
