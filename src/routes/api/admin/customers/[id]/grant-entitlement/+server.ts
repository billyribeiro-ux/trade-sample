import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestEvent } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { handleApiError } from '$lib/server/http';
import { grantEntitlement } from '$lib/server/services/entitlements';
import { grantEntitlementSchema } from '$lib/schemas/entitlement';

export async function POST(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'entitlement.grant');
    const payload = v.parse(grantEntitlementSchema, await event.request.json());
    const grantInput: Parameters<typeof grantEntitlement>[0] = {
      actorId: event.locals.user?.id ?? '',
      customerId: event.params.id,
      productId: payload.productId,
    };

    if (payload.downloadsAllowed !== undefined) {
      grantInput.downloadsAllowed = payload.downloadsAllowed;
    }

    const entitlement = await grantEntitlement(grantInput);

    return json({ entitlement }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
