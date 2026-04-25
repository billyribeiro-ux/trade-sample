# Installation and API Keys

This guide covers local installation, Stripe test setup, and where to add real
API keys when preparing for deployment.

## Local Installation

Requirements:

- Node.js 22
- Corepack enabled
- Docker Desktop
- Stripe CLI, when testing checkout/webhooks

Install and run:

```bash
corepack enable
pnpm install
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev -- --port 5173
```

Local app URL:

```txt
http://localhost:5173
```

Seeded users use:

```txt
Password: TestPass!234
Admin: admin@trading.test
Customer: customer1@trading.test
```

## Local Environment File

Local secrets live in `.env`. That file is ignored by Git.

Use `.env.example` as the template:

```bash
cp .env.example .env
```

Important local values:

```txt
PUBLIC_APP_URL=http://localhost:5173
DATABASE_URL=postgres://trading_store:trading_store@127.0.0.1:55432/trading_store
DATABASE_URL_UNPOOLED=postgres://trading_store:trading_store@127.0.0.1:55432/trading_store
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=local-development-secret-change-me
```

## Stripe Test Setup

Stripe docs example keys can be used as placeholders, but real test checkout
requires your own Stripe account test-mode keys.

Add your test keys in `.env`:

```txt
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_local_webhook_secret
```

Find keys here:

- Stripe API keys: https://dashboard.stripe.com/test/apikeys
- Webhook signing secret: run `pnpm stripe:listen` and copy the printed
  `whsec_...` value.

Sync seeded products/prices to Stripe:

```bash
pnpm stripe:sync
```

Forward local webhooks:

```bash
pnpm stripe:listen
```

Use Stripe test cards only:

```txt
Success: 4242 4242 4242 4242
3DS auth: 4000 0025 0000 3155
Declined: 4000 0000 0000 9995
```

Use any future expiration date, any three-digit CVC, and any postal code.

## Deployment Environment Variables

When deploying to Vercel, add these values in:

```txt
Vercel Project -> Settings -> Environment Variables
```

Set values per environment: Preview and Production.

### Required

```txt
PUBLIC_APP_URL=https://your-production-domain.com
DATABASE_URL=your_hosted_postgres_pooled_url
DATABASE_URL_UNPOOLED=your_hosted_postgres_unpooled_url
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=https://your-production-domain.com
STRIPE_SECRET_KEY=sk_live_or_sk_test_for_that_environment
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_for_that_environment
STRIPE_WEBHOOK_SECRET=whsec_from_that_stripe_webhook_endpoint
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
DOWNLOAD_SIGNING_SECRET=your_long_random_download_secret
```

### Optional

```txt
RESEND_API_KEY=your_resend_key
EMAIL_FROM=The Trading Store <support@your-domain.com>
EMAIL_REPLY_TO=support@your-domain.com
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
PUBLIC_SENTRY_DSN=your_sentry_public_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

## Where Real API Keys Come From

| Service | Variable | Where to get it |
|---|---|---|
| Stripe | `STRIPE_SECRET_KEY` | Stripe Dashboard -> Developers -> API keys |
| Stripe | `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard -> Developers -> API keys |
| Stripe | `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard -> Developers -> Webhooks -> endpoint signing secret |
| Better Auth | `BETTER_AUTH_SECRET` | Generate locally with `openssl rand -base64 32` |
| Vercel Blob | `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard -> Storage -> Blob |
| App downloads | `DOWNLOAD_SIGNING_SECRET` | Generate locally with `openssl rand -base64 32` |
| Resend | `RESEND_API_KEY` | Resend Dashboard -> API Keys |
| Upstash | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis database details |

## Production Stripe Checklist

1. Create or select the production Stripe account.
2. Add live keys to Vercel Production env vars.
3. Create a Stripe webhook endpoint pointing to:

```txt
https://your-production-domain.com/api/webhooks/stripe
```

4. Subscribe the endpoint to:

```txt
checkout.session.completed
payment_intent.payment_failed
charge.refunded
charge.dispute.created
```

5. Copy the endpoint signing secret into `STRIPE_WEBHOOK_SECRET`.
6. Deploy.
7. Run a small live-mode verification only when ready to accept real payments.

## Verification Commands

Before handoff or deployment:

```bash
pnpm run ci
pnpm test:e2e
```

GitHub Actions runs the same checks on `main`, including a Postgres service and
Playwright browser smoke test.

