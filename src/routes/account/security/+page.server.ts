import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq, gt } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { auditLog, sessions } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    return {
      sessions: [],
      currentSessionId: null,
    };
  }

  return {
    currentSessionId: locals.session?.id ?? null,
    sessions: await db
      .select({
        id: sessions.id,
        expiresAt: sessions.expiresAt,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
      })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())))
      .orderBy(desc(sessions.updatedAt)),
  };
};

export const actions: Actions = {
  revokeSession: async ({ locals, request, getClientAddress }) => {
    const userId = locals.user?.id;
    const currentSessionId = locals.session?.id;

    if (!userId) {
      return fail(401, { error: 'Sign in to manage sessions.' });
    }

    const formData = await request.formData();
    const sessionId = formData.get('sessionId');

    if (typeof sessionId !== 'string' || sessionId.length < 1) {
      return fail(400, { error: 'Choose a session to revoke.' });
    }

    const [session] = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
      .limit(1);

    if (!session) {
      return fail(404, { error: 'Session was not found.' });
    }

    await db.transaction(async (tx) => {
      await tx.delete(sessions).where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
      await tx.insert(auditLog).values({
        actorId: userId,
        action: 'account.session_revoked',
        resourceType: 'user',
        resourceId: userId,
        metadata: {
          revokedSessionId: sessionId,
          current: sessionId === currentSessionId,
        },
        ipAddress: getClientAddress(),
      });
    });

    if (sessionId === currentSessionId) {
      throw redirect(303, '/auth/sign-in');
    }

    return { success: 'Session revoked.' };
  },
};
