# Stripe Testing Runbook

Use Stripe test-mode keys in `.env`. Keep localhost on test keys and test cards
only.

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

Keep the listener running during checkout, refund, failure, and dispute testing.
Copy the emitted `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

Useful Stripe test cards:

| Scenario | Card | Expected result |
|---|---|---|
| Successful payment | `4242 4242 4242 4242` | Purchase completes, entitlement is granted, receipt URL is captured when Stripe provides one. |
| Requires authentication | `4000 0025 0000 3155` | Checkout requires 3DS authentication before completion. |
| Declined | `4000 0000 0000 9995` | Checkout fails and `payment_intent.payment_failed` is audit logged. |
| Insufficient funds | `4000 0000 0000 9995` | Treat as a failed payment path. |

Use any future expiry date, any CVC, and any postal code.

## Webhook Events Covered

| Event | App behavior |
|---|---|
| `checkout.session.completed` | Creates or reuses the purchase, grants entitlement, sends purchase email. |
| `payment_intent.payment_failed` | Writes an audit event for support/debugging. |
| `charge.refunded` | Marks purchase refunded, revokes entitlement, sends refund email. |
| `charge.dispute.created` | Marks purchase disputed, revokes entitlement, writes audit event. |

## Manual CLI Events

Use the Stripe CLI to trigger events when a full browser checkout is not needed:

```bash
stripe trigger payment_intent.payment_failed
stripe trigger charge.refunded
stripe trigger charge.dispute.created
```

Some generated CLI fixtures may not include the app metadata needed to link back
to seeded purchases. Use browser checkout for the authoritative end-to-end path.
