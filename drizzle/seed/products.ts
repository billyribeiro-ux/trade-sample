import { prices, products } from '../../src/lib/server/db/schema';
import { seedDb } from './db';
import { seedIds } from './ids';

export const productSeeds = [
  {
    id: seedIds.products.book1,
    slug: 'book-1',
    name: 'Book 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    fileBlobPathname: 'books/book-1.pdf',
    downloadPolicy: 'unlimited' as const,
    downloadLimit: null,
    priceId: seedIds.prices.book1,
    amountCents: 49_900,
  },
  {
    id: seedIds.products.book2,
    slug: 'book-2',
    name: 'Book 2',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    fileBlobPathname: 'books/book-2.pdf',
    downloadPolicy: 'capped' as const,
    downloadLimit: 3,
    priceId: seedIds.prices.book2,
    amountCents: 99_900,
  },
];

export async function seedProducts(): Promise<void> {
  for (const product of productSeeds) {
    await seedDb
      .insert(products)
      .values({
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        fileBlobPathname: product.fileBlobPathname,
        downloadPolicy: product.downloadPolicy,
        downloadLimit: product.downloadLimit,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: product.name,
          description: product.description,
          fileBlobPathname: product.fileBlobPathname,
          downloadPolicy: product.downloadPolicy,
          downloadLimit: product.downloadLimit,
          isActive: true,
        },
      });

    await seedDb
      .insert(prices)
      .values({
        id: product.priceId,
        productId: product.id,
        amountCents: product.amountCents,
        currency: 'usd',
        isActive: true,
      })
      .onConflictDoNothing();
  }
}
