# The Trading Store

The Trading Store is a premium digital storefront for two downloadable trading books.
Customers buy once through Stripe Checkout, then access their purchases from a private
library backed by server-authorized downloads.

## Product

- Book 1: 499 USD, unlimited lifetime downloads.
- Book 2: 999 USD, three lifetime downloads per customer.
- One-time purchases only. No subscriptions, upsells, marketplace, or community layer.
- Admin dashboard for products, customers, refunds, entitlements, file uploads, and audit history.

## Stack

- SvelteKit 2, Svelte 5 runes, TypeScript strict mode
- pnpm 10.x
- Drizzle ORM with Neon Postgres
- Better Auth
- Stripe Checkout and Stripe webhooks
- Vercel Blob private files with signed download URLs
- Resend transactional email
- Upstash Redis rate limiting
- Biome, Vitest, Playwright, lefthook, commitlint, gitleaks

## Local Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Local development runs at `http://localhost:5173`.

## Engineering Rules

- Use `pnpm` only.
- Keep TypeScript strict with zero `any` and zero ignored errors.
- Keep products, prices, and download policies in the database.
- Treat Stripe as the payment processor, not the pricing source.
- Authorize every protected download server-side.
- Log all security, billing, entitlement, and admin actions.
- Respect the product vision in `TRADING_STORE_VISION.md`.

