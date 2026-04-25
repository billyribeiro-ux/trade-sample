import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, url }) => {
  const callbackURL = url.searchParams.get('callbackURL') ?? '/library';

  throw redirect(
    303,
    `/api/auth/verify-email?token=${encodeURIComponent(params.token)}&callbackURL=${encodeURIComponent(callbackURL)}`,
  );
};
