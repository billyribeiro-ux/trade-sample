import { listActiveProducts } from '$lib/server/services/products';
import { ConfigurationError } from '$lib/server/errors';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    return {
      products: await listActiveProducts(),
      setupRequired: false,
      setupMessage: null,
    };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      return {
        products: [],
        setupRequired: true,
        setupMessage: error.message,
      };
    }

    throw error;
  }
};
