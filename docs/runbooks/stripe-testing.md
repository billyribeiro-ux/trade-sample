# Stripe Testing Runbook

Use Stripe test mode keys in `.env`.

```bash
STRIPE_SECRET_KEY=sk_test_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Sync database products and prices to Stripe:

```bash
pnpm stripe:sync
```

Forward webhooks while developing:

```bash
pnpm stripe:listen
```

Useful Stripe test cards:

| Scenario | Card |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Requires authentication | `4000 0025 0000 3155` |
| Declined | `4000 0000 0000 9995` |

Use any future expiry date, any CVC, and any postal code.

