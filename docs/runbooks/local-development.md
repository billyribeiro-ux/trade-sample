# Local Development Runbook

## Required Local Services

The app runs on localhost, but it still needs a Postgres-compatible database.
Use a Neon development database or a local Postgres instance and put the URL in `.env`.

```bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Seeded users all use this password:

```txt
TestPass!234
```

## Local URLs

- App: `http://localhost:5173`
- Stripe webhook endpoint: `http://localhost:5173/api/webhooks/stripe`

## Notes

If `RESEND_API_KEY` is absent, transactional emails are logged to the terminal.
If Upstash env vars are absent, rate limits become a local no-op.

