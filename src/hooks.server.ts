import { building } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

import { auth } from '$lib/server/auth';
import { hasPermission } from '$lib/server/auth/rbac';

function securityHeaders(headers: Headers): void {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: *.public.blob.vercel-storage.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' api.stripe.com api.resend.com *.upstash.io",
      'frame-src js.stripe.com hooks.stripe.com',
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  event.locals.session = session?.session ?? null;
  event.locals.user = session?.user ?? null;

  if (event.url.pathname.startsWith('/admin')) {
    if (!event.locals.user || !(await hasPermission(event.locals.user.id, 'admin.access'))) {
      throw redirect(303, '/auth/sign-in');
    }
  }

  if (
    ['/library', '/account'].some((prefix) => event.url.pathname.startsWith(prefix)) &&
    !event.locals.user
  ) {
    throw redirect(303, `/auth/sign-in?redirect=${encodeURIComponent(event.url.pathname)}`);
  }

  return svelteKitHandler({
    event,
    resolve: async (nextEvent) => {
      const response = await resolve(nextEvent);
      securityHeaders(response.headers);
      return response;
    },
    auth,
    building,
  });
};
