import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

import { requirePermission } from '$lib/server/auth/rbac';
import { db } from '$lib/server/db';
import { auditLog, products } from '$lib/server/db/schema';
import { ValidationError } from '$lib/server/errors';
import { handleApiError } from '$lib/server/http';
import { getActiveProductBySlug } from '$lib/server/services/products';
import { uploadProductFile } from '$lib/server/storage/blob';

export async function POST(event: RequestEvent): Promise<Response> {
  try {
    await requirePermission(event, 'product.update');
    const product = await getActiveProductBySlug(event.params.slug);
    const form = await event.request.formData();
    const file = form.get('file');

    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      throw new ValidationError('Upload an image file.');
    }

    const extension = file.type.split('/')[1] ?? 'png';
    const pathname = `covers/${product.slug}.${extension}`;
    const blob = await uploadProductFile(pathname, file.stream(), file.type);
    await db
      .update(products)
      .set({ coverImageBlobPathname: blob.pathname, updatedAt: new Date() })
      .where(eq(products.id, product.id));

    await db.insert(auditLog).values({
      actorId: event.locals.user?.id,
      action: 'product.cover_uploaded',
      resourceType: 'product',
      resourceId: product.id,
      metadata: { pathname: blob.pathname },
    });

    return json({ pathname: blob.pathname });
  } catch (error) {
    return handleApiError(error);
  }
}
