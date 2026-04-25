import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { handleApiError } from '$lib/server/http';
import { revokeEntitlement } from '$lib/server/services/entitlements';

export async function POST(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'entitlement.revoke');
    const entitlement = await revokeEntitlement({
      actorId: event.locals.user?.id ?? '',
      entitlementId: event.params.id,
    });

    return json({ entitlement });
  } catch (error) {
    return handleApiError(error);
  }
}
