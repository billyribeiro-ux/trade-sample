# Final Verification Runbook

Run this checklist before tagging or handing off a localhost build.

## Static Verification

```bash
pnpm run ci
```

This runs Biome linting, Svelte type checking, Vitest unit tests, and the
production build.

## Local Verification

```bash
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev -- --port 5173
```

Open `http://localhost:5173` and verify:

1. Storefront loads with both seeded books.
2. Sign-in and sign-up pages render.
3. Member library redirects unauthenticated users to sign-in.
4. Account profile, password, purchases, and security pages render for a signed-in user.
5. Admin dashboard, products, customers, purchases, and audit log render for an admin user.
6. Legal pages render from the footer.

## Stripe Verification

1. Add Stripe test keys to `.env`.
2. Run `pnpm stripe:sync`.
3. Run `pnpm stripe:listen` and copy the webhook secret into `.env`.
4. Complete checkout with `4242 4242 4242 4242`.
5. Confirm entitlement grant and library download.
6. Trigger refund from admin purchases.
7. Confirm refunded status, revoked entitlement, refund email/log output, and audit events.

## GitHub Verification

After pushing `main`, confirm the GitHub Actions CI workflow passes. The workflow
uses Corepack and the single package manager declaration in `package.json`.
