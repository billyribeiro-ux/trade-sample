import { json } from '@sveltejs/kit';

import { AppError } from '$lib/server/errors';

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}
