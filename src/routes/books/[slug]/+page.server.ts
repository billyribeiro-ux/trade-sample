import { getActiveProductBySlug } from '$lib/server/services/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
  product: await getActiveProductBySlug(params.slug),
});
