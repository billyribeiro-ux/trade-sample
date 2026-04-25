# Local Development Runbook

## Required Local Services

The app runs on localhost and defaults to the local Postgres service in `docker-compose.yml`.
Use pnpm through Corepack; the exact package manager version is declared once in
`package.json`.

```bash
corepack enable
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

Use Stripe test-mode API keys from the Stripe dashboard in `.env`. Do not use live
keys for localhost.

```txt
STRIPE_SECRET_KEY=sk_test_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Start webhook forwarding in a second terminal:

```bash
pnpm stripe:listen
```

Sync seeded products/prices to Stripe before checkout testing:

```bash
pnpm stripe:sync
```

Use Stripe test cards only. The happy-path card is `4242 4242 4242 4242`.
Use any future expiration date, any three-digit CVC, and any postal code.

## Local Smoke Path

1. Sign in as the seeded admin user.
2. Open `/admin/products` and confirm both books have Stripe price IDs after sync.
3. Open `/books/<slug>`, start checkout, and pay with `4242 4242 4242 4242`.
4. Wait for `checkout.session.completed` in the Stripe listener.
5. Confirm `/checkout/success?session_id=...` resolves to the ready state.
6. Confirm `/library` shows the purchased book and starts a signed download.
7. Open `/admin/purchases`, filter by customer email, and confirm the purchase.
8. Start a refund from `/admin/purchases` and wait for `charge.refunded`.
9. Confirm the entitlement is revoked and `/admin/audit-log` records the events.

## Notes

If `RESEND_API_KEY` is absent, transactional emails are logged to the terminal.
If Upstash env vars are absent, rate limits become a local no-op.
