import { seedPermissions } from './permissions';
import { seedPersonas, seedPassword } from './personas';
import { seedProducts } from './products';
import { seedPurchases } from './purchases';

async function main(): Promise<void> {
  await seedPermissions();
  await seedProducts();
  await seedPersonas();
  await seedPurchases();

  console.log(`Seed complete. Test password for seeded users: ${seedPassword}`);
}

await main();
