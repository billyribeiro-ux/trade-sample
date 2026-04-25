import { and, eq, isNull } from 'drizzle-orm';

import { getAppUrl, sendEmail } from '$lib/server/email';
import { entitlementGrantedTemplate } from '$lib/server/email/templates';
import { db } from '$lib/server/db';
import { auditLog, entitlements, products, users } from '$lib/server/db/schema';
import { NotFoundError, ValidationError } from '$lib/server/errors';

type ProductPolicy = {
  downloadPolicy: 'unlimited' | 'capped';
  downloadLimit: number | null;
};

export function resolveDownloadsAllowed(
  product: ProductPolicy,
  requestedDownloadsAllowed?: number | null,
): number | null {
  if (requestedDownloadsAllowed !== undefined && requestedDownloadsAllowed !== null) {
    return requestedDownloadsAllowed;
  }

  if (product.downloadPolicy === 'unlimited') {
    return null;
  }

  return product.downloadLimit ?? 3;
}

export async function grantEntitlement(input: {
  actorId: string;
  customerId: string;
  productId: string;
  downloadsAllowed?: number | null;
}) {
  const [customer] = await db.select().from(users).where(eq(users.id, input.customerId)).limit(1);

  if (!customer) {
    throw new NotFoundError('Customer not found.');
  }

  const [product] = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);

  if (!product?.isActive || product.deletedAt) {
    throw new NotFoundError('Product not found.');
  }

  const [existing] = await db
    .select({ id: entitlements.id })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, customer.id),
        eq(entitlements.productId, product.id),
        isNull(entitlements.revokedAt),
      ),
    )
    .limit(1);

  if (existing) {
    throw new ValidationError('Customer already has active access to this product.');
  }

  const downloadsAllowed = resolveDownloadsAllowed(product, input.downloadsAllowed);
  const [entitlement] = await db
    .insert(entitlements)
    .values({
      userId: customer.id,
      productId: product.id,
      purchaseId: null,
      downloadsAllowed,
      downloadsUsed: 0,
    })
    .returning();

  if (!entitlement) {
    throw new ValidationError('Entitlement could not be granted.');
  }

  await db.insert(auditLog).values({
    actorId: input.actorId,
    action: 'entitlement.granted',
    resourceType: 'entitlement',
    resourceId: entitlement.id,
    metadata: {
      customerId: customer.id,
      productId: product.id,
      downloadsAllowed,
    },
  });

  const template = entitlementGrantedTemplate({
    bookTitle: product.name,
    libraryUrl: `${getAppUrl()}/library`,
  });

  await sendEmail({
    to: customer.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return entitlement;
}

export async function revokeEntitlement(input: {
  actorId: string;
  entitlementId: string;
}) {
  const [entitlement] = await db
    .select({
      id: entitlements.id,
      userId: entitlements.userId,
      productId: entitlements.productId,
    })
    .from(entitlements)
    .where(and(eq(entitlements.id, input.entitlementId), isNull(entitlements.revokedAt)))
    .limit(1);

  if (!entitlement) {
    throw new NotFoundError('Active entitlement not found.');
  }

  const [revoked] = await db
    .update(entitlements)
    .set({ revokedAt: new Date() })
    .where(eq(entitlements.id, entitlement.id))
    .returning();

  if (!revoked) {
    throw new ValidationError('Entitlement could not be revoked.');
  }

  await db.insert(auditLog).values({
    actorId: input.actorId,
    action: 'entitlement.revoked',
    resourceType: 'entitlement',
    resourceId: entitlement.id,
    metadata: {
      customerId: entitlement.userId,
      productId: entitlement.productId,
    },
  });

  return revoked;
}
