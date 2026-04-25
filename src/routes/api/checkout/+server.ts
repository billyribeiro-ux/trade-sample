import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

import { handleApiError } from '$lib/server/http';
import { createCheckoutSession } from '$lib/server/services/checkout';
import { ValidationError } from '$lib/server/errors';

export async function POST(event: RequestEvent): Promise<Response> {
  try {
    const { slug } = (await event.request.json()) as { slug?: string };

    if (!slug) {
      throw new ValidationError('Product slug is required.');
    }

    return json({ url: await createCheckoutSession(event, slug) });
  } catch (error) {
    return handleApiError(error);
  }
}
