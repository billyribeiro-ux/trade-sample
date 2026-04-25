import { json } from '@sveltejs/kit';

import { handleApiError } from '$lib/server/http';
import { listActiveProducts } from '$lib/server/services/products';

export async function GET(): Promise<Response> {
  try {
    return json({ products: await listActiveProducts() });
  } catch (error) {
    return handleApiError(error);
  }
}
