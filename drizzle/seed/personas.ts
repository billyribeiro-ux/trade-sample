import { accounts, roleAssignments, users } from '../../src/lib/server/db/schema';
import { hashPassword } from '../../src/lib/server/auth/password';
import { seedDb } from './db';
import { seedIds } from './ids';

export const seedPassword = 'TestPass!234';

export const personas = [
  {
    id: seedIds.users.admin,
    email: 'admin@trading.test',
    name: 'Admin User',
    roleId: seedIds.roles.admin,
  },
  {
    id: seedIds.users.customer1,
    email: 'customer1@trading.test',
    name: 'Customer One',
    roleId: seedIds.roles.customer,
  },
  {
    id: seedIds.users.customer2,
    email: 'customer2@trading.test',
    name: 'Customer Two',
    roleId: seedIds.roles.customer,
  },
  {
    id: seedIds.users.customer3,
    email: 'customer3@trading.test',
    name: 'Customer Three',
    roleId: seedIds.roles.customer,
  },
  {
    id: seedIds.users.customer4,
    email: 'customer4@trading.test',
    name: 'Customer Four',
    roleId: seedIds.roles.customer,
  },
];

export async function seedPersonas(): Promise<void> {
  for (const persona of personas) {
    const passwordHash = await hashPassword(seedPassword);

    await seedDb
      .insert(users)
      .values({
        id: persona.id,
        email: persona.email,
        emailVerified: true,
        name: persona.name,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: persona.name,
          emailVerified: true,
        },
      });

    await seedDb
      .insert(accounts)
      .values({
        userId: persona.id,
        accountId: persona.id,
        providerId: 'credential',
        password: passwordHash,
      })
      .onConflictDoUpdate({
        target: [accounts.providerId, accounts.accountId],
        set: {
          password: passwordHash,
        },
      });

    await seedDb
      .insert(roleAssignments)
      .values({
        userId: persona.id,
        roleId: persona.roleId,
        assignedById: seedIds.users.admin,
      })
      .onConflictDoNothing();
  }
}
