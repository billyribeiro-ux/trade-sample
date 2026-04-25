import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
  const token = url.searchParams.get('token');
  const callbackURL = url.searchParams.get('callbackURL') ?? '/library';

  if (!token) {
    throw redirect(303, '/auth/sign-in?error=missing_verification_token');
  }

  throw redirect(
    303,
    `/api/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(callbackURL)}`,
  );
};
