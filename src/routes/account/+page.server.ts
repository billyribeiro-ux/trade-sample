import { fail } from '@sveltejs/kit';
import { count, eq, sql } from 'drizzle-orm';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';

import { changePasswordSchema, updateProfileSchema } from '$lib/schemas/auth';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { auditLog, entitlements, purchases, sessions, users } from '$lib/server/db/schema';

function stringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function validationMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Please check the form and try again.';
}

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    return {
      profile: null,
      summary: {
        activeEntitlements: 0,
        totalPurchases: 0,
        activeSessions: 0,
        lastPurchaseAt: null,
      },
    };
  }

  const [[profile], [entitlementSummary], [purchaseSummary], [sessionSummary]] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1),
    db
      .select({ value: count() })
      .from(entitlements)
      .where(sql`${entitlements.userId} = ${userId} and ${entitlements.revokedAt} is null`),
    db
      .select({
        value: count(),
        lastPurchaseAt: sql<Date | null>`max(${purchases.purchasedAt})`,
      })
      .from(purchases)
      .where(eq(purchases.userId, userId)),
    db
      .select({ value: count() })
      .from(sessions)
      .where(sql`${sessions.userId} = ${userId} and ${sessions.expiresAt} > now()`),
  ]);

  return {
    profile,
    summary: {
      activeEntitlements: entitlementSummary?.value ?? 0,
      totalPurchases: purchaseSummary?.value ?? 0,
      activeSessions: sessionSummary?.value ?? 0,
      lastPurchaseAt: purchaseSummary?.lastPurchaseAt ?? null,
    },
  };
};

export const actions: Actions = {
  updateProfile: async ({ locals, request, getClientAddress }) => {
    const userId = locals.user?.id;

    if (!userId) {
      return fail(401, { action: 'updateProfile', error: 'Sign in to update your profile.' });
    }

    try {
      const formData = await request.formData();
      const payload = v.parse(updateProfileSchema, {
        name: stringField(formData, 'name'),
      });

      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ name: payload.name, updatedAt: new Date() })
          .where(eq(users.id, userId));

        await tx.insert(auditLog).values({
          actorId: userId,
          action: 'account.profile_updated',
          resourceType: 'user',
          resourceId: userId,
          ipAddress: getClientAddress(),
        });
      });

      return { action: 'updateProfile', success: 'Profile updated.' };
    } catch (error) {
      return fail(400, {
        action: 'updateProfile',
        error: validationMessage(error),
      });
    }
  },
  changePassword: async ({ locals, request, getClientAddress }) => {
    const userId = locals.user?.id;

    if (!userId) {
      return fail(401, { action: 'changePassword', error: 'Sign in to change your password.' });
    }

    try {
      const formData = await request.formData();
      const payload = v.parse(changePasswordSchema, {
        currentPassword: stringField(formData, 'currentPassword'),
        newPassword: stringField(formData, 'newPassword'),
        confirmPassword: stringField(formData, 'confirmPassword'),
      });

      if (payload.newPassword !== payload.confirmPassword) {
        return fail(400, { action: 'changePassword', error: 'Passwords do not match.' });
      }

      await auth.api.changePassword({
        headers: request.headers,
        body: {
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
          revokeOtherSessions: true,
        },
      });

      await db.insert(auditLog).values({
        actorId: userId,
        action: 'account.password_changed',
        resourceType: 'user',
        resourceId: userId,
        ipAddress: getClientAddress(),
      });

      return {
        action: 'changePassword',
        success: 'Password changed. Other sessions were signed out.',
      };
    } catch {
      return fail(400, {
        action: 'changePassword',
        error: 'Current password could not be verified.',
      });
    }
  },
};
