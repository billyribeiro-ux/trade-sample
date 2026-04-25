import type { RequestEvent } from '@sveltejs/kit';

import { PermissionError } from '$lib/server/errors';

export function requireUser(event: RequestEvent): NonNullable<App.Locals['user']> {
  if (!event.locals.user) {
    throw new PermissionError('Sign in is required.');
  }

  return event.locals.user;
}
