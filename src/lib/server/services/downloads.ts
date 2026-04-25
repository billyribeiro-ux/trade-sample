import { and, eq, isNull, lt, or } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { auditLog, downloadLog, entitlements } from '$lib/server/db/schema';
import { DownloadQuotaExceededError, EntitlementError } from '$lib/server/errors';
import { createDownloadToken } from '$lib/server/storage/download-token';
import { getActiveProductBySlug } from './products';

function getIpAddress(event: RequestEvent): string | null {
  return event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
}

export async function createDownload(
  event: RequestEvent,
  slug: string,
): Promise<{
  url: string;
  expiresAt: string;
  downloadsRemaining: number | null;
}> {
  const user = event.locals.user;

  if (!user) {
    throw new EntitlementError('Sign in is required to download this book.');
  }

  const product = await getActiveProductBySlug(slug);
  const [entitlement] = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, user.id),
        eq(entitlements.productId, product.id),
        isNull(entitlements.revokedAt),
      ),
    )
    .limit(1);

  if (!entitlement) {
    throw new EntitlementError();
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const [updated] = await db
    .update(entitlements)
    .set({
      downloadsUsed: entitlement.downloadsUsed + 1,
    })
    .where(
      and(
        eq(entitlements.id, entitlement.id),
        or(
          isNull(entitlements.downloadsAllowed),
          lt(entitlements.downloadsUsed, entitlements.downloadsAllowed),
        ),
      ),
    )
    .returning();

  if (!updated) {
    throw new DownloadQuotaExceededError();
  }

  await db.insert(downloadLog).values({
    userId: user.id,
    productId: product.id,
    entitlementId: entitlement.id,
    ipAddress: getIpAddress(event),
    userAgent: event.request.headers.get('user-agent'),
    signedUrlExpiresAt: expiresAt,
  });

  await db.insert(auditLog).values({
    actorId: user.id,
    action: 'download.created',
    resourceType: 'product',
    resourceId: product.id,
    metadata: {
      slug,
      entitlementId: entitlement.id,
      expiresAt: expiresAt.toISOString(),
    },
    ipAddress: getIpAddress(event),
  });

  const token = createDownloadToken({
    userId: user.id,
    productId: product.id,
    entitlementId: entitlement.id,
    pathname: product.fileBlobPathname,
    expiresAt: expiresAt.toISOString(),
  });

  return {
    url: `/api/books/${product.slug}/file?token=${encodeURIComponent(token)}`,
    expiresAt: expiresAt.toISOString(),
    downloadsRemaining:
      updated.downloadsAllowed === null
        ? null
        : Math.max(updated.downloadsAllowed - updated.downloadsUsed, 0),
  };
}
