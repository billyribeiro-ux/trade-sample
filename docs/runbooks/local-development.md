# Local Development Runbook

## Required Local Services

The app runs on localhost and defaults to the local Postgres service in `docker-compose.yml`.

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev -- --port 5173
```

The default database URL is:

```txt
postgres://trading_store:trading_store@127.0.0.1:55432/trading_store
```

Seeded users all use this password:

```txt
TestPass!234
```

## Local URLs

- App: `http://localhost:5173`
- Stripe webhook endpoint: `http://localhost:5173/api/webhooks/stripe`

## Stripe Test Mode

Use Stripe sandbox API keys in `.env`:

```txt
STRIPE_SECRET_KEY=sk_test_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Start webhook forwarding in a second terminal:

```bash
pnpm stripe:listen
```

Use Stripe test cards only. The happy-path card is `4242 4242 4242 4242`;
use any future expiration date and any three-digit CVC.

## Notes

If `RESEND_API_KEY` is absent, transactional emails are logged to the terminal.
If Upstash env vars are absent, rate limits become a local no-op.
