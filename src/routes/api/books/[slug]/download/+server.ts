import type { RequestEvent } from './$types';
import { json } from '@sveltejs/kit';

import { enforceRateLimit } from '$lib/server/security/rate-limit';
import { createDownload } from '$lib/server/services/downloads';
import { handleApiError } from '$lib/server/http';

export async function POST(event: RequestEvent): Promise<Response> {
  try {
    const userId = event.locals.user?.id ?? event.getClientAddress();
    await enforceRateLimit('download', userId);
    return json(await createDownload(event, event.params.slug));
  } catch (error) {
    return handleApiError(error);
  }
}
