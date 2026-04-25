import { listActiveProducts } from '$lib/server/services/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
  products: await listActiveProducts(),
});
