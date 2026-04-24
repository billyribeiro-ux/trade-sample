import { permissions, rolePermissions, roles } from '../../src/lib/server/db/schema';
import { seedDb } from './db';
import { seedIds } from './ids';

export const permissionNames = [
  'admin.access',
  'product.read',
  'product.create',
  'product.update',
  'product.delete',
  'purchase.read.own',
  'purchase.read.all',
  'purchase.refund',
  'entitlement.grant',
  'entitlement.revoke',
  'download.execute',
  'audit.read',
] as const;

export type SeedPermission = (typeof permissionNames)[number];

const roleSeeds = [
  {
    id: seedIds.roles.admin,
    name: 'admin',
    description: 'Full administrative access.',
    permissions: permissionNames,
  },
  {
    id: seedIds.roles.customer,
    name: 'customer',
    description: 'Customer access for purchases, library, and downloads.',
    permissions: ['purchase.read.own', 'download.execute'] satisfies SeedPermission[],
  },
];

export async function seedPermissions(): Promise<void> {
  const permissionIdByName = new Map<SeedPermission, string>();

  for (const [index, name] of permissionNames.entries()) {
    const id = `00000000-0000-4000-8000-${(601 + index).toString().padStart(12, '0')}`;
    permissionIdByName.set(name, id);

    await seedDb
      .insert(permissions)
      .values({
        id,
        name,
        description: `Allows ${name}.`,
      })
      .onConflictDoUpdate({
        target: permissions.name,
        set: {
          description: `Allows ${name}.`,
        },
      });
  }

  for (const role of roleSeeds) {
    await seedDb
      .insert(roles)
      .values({
        id: role.id,
        name: role.name,
        description: role.description,
      })
      .onConflictDoUpdate({
        target: roles.name,
        set: {
          description: role.description,
        },
      });

    for (const permission of role.permissions) {
      const permissionId = permissionIdByName.get(permission);

      if (!permissionId) {
        throw new Error(`Missing permission id for ${permission}.`);
      }

      await seedDb
        .insert(rolePermissions)
        .values({
          roleId: role.id,
          permissionId,
        })
        .onConflictDoNothing();
    }
  }
}
