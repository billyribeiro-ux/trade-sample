import * as v from 'valibot';

export const productPayloadSchema = v.object({
  slug: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(80), v.regex(/^[a-z0-9-]+$/)),
  name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(160)),
  description: v.nullish(v.pipe(v.string(), v.trim(), v.maxLength(4000))),
  amountCents: v.pipe(v.number(), v.integer(), v.minValue(1)),
  downloadPolicy: v.picklist(['unlimited', 'capped']),
  downloadLimit: v.nullish(v.pipe(v.number(), v.integer(), v.minValue(1))),
  isActive: v.optional(v.boolean(), true),
});

export type ProductPayload = v.InferOutput<typeof productPayloadSchema>;
