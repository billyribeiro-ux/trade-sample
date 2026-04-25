import { error } from '@sveltejs/kit';
import { and, desc, eq, or, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { db } from '$lib/server/db';
import { auditLog, entitlements, prices, products, purchases, users } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
  await requirePermission(event, 'purchase.read.all');

  const [customer] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      stripeCustomerId: users.stripeCustomerId,
    })
    .from(users)
    .where(eq(users.id, event.params.id))
    .limit(1);

  if (!customer) {
    throw error(404, 'Customer not found.');
  }

  const customerPurchases = await db
    .select({
      id: purchases.id,
      productName: products.name,
      amountPaidCents: purchases.amountPaidCents,
      currency: purchases.currency,
      status: purchases.status,
      purchasedAt: purchases.purchasedAt,
      refundedAt: purchases.refundedAt,
      stripeReceiptUrl: purchases.stripeReceiptUrl,
    })
    .from(purchases)
    .innerJoin(products, eq(purchases.productId, products.id))
    .where(eq(purchases.userId, customer.id))
    .orderBy(desc(purchases.purchasedAt));

  const customerEntitlements = await db
    .select({
      id: entitlements.id,
      productId: products.id,
      productName: products.name,
      productPolicy: products.downloadPolicy,
      downloadsAllowed: entitlements.downloadsAllowed,
      downloadsUsed: entitlements.downloadsUsed,
      grantedAt: entitlements.grantedAt,
      revokedAt: entitlements.revokedAt,
      purchaseId: entitlements.purchaseId,
    })
    .from(entitlements)
    .innerJoin(products, eq(entitlements.productId, products.id))
    .where(eq(entitlements.userId, customer.id))
    .orderBy(desc(entitlements.grantedAt));

  const customerAudit = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      resourceType: auditLog.resourceType,
      resourceId: auditLog.resourceId,
      metadata: auditLog.metadata,
      createdAt: auditLog.createdAt,
    })
    .from(auditLog)
    .where(
      or(
        eq(auditLog.actorId, customer.id),
        and(eq(auditLog.resourceType, 'user'), eq(auditLog.resourceId, customer.id)),
        sql`${auditLog.metadata}->>'customerId' = ${customer.id}`,
      ),
    )
    .orderBy(desc(auditLog.createdAt))
    .limit(50);

  const grantableProducts = await db
    .select({
      id: products.id,
      name: products.name,
      downloadPolicy: products.downloadPolicy,
      downloadLimit: products.downloadLimit,
      amountCents: prices.amountCents,
    })
    .from(products)
    .innerJoin(prices, eq(products.id, prices.productId))
    .where(and(eq(products.isActive, true), eq(prices.isActive, true)))
    .orderBy(desc(products.createdAt));

  const totalSpentCents = customerPurchases
    .filter((purchase) => purchase.status === 'completed')
    .reduce((total, purchase) => total + purchase.amountPaidCents, 0);

  return {
    customer,
    purchases: customerPurchases,
    entitlements: customerEntitlements,
    auditLog: customerAudit,
    grantableProducts,
    totalSpentCents,
  };
};
