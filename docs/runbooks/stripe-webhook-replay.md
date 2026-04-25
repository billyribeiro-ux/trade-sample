# Stripe Webhook Replay

Webhook events are idempotent by Stripe event ID.

To replay a test event:

```bash
stripe events resend <event_id> --webhook-endpoint <endpoint_id>
```

The app skips events that already have `processed_at`.

## Local Replay Checklist

1. Keep `pnpm stripe:listen` running.
2. Find the event ID in the Stripe CLI output or dashboard.
3. Resend the event to the local webhook endpoint.
4. Confirm the app records only one processed webhook row for that event ID.
5. Confirm audit log side effects remain idempotent for purchase completion,
   refunds, and disputes.

Use replay to validate these event types:

- `checkout.session.completed`
- `payment_intent.payment_failed`
- `charge.refunded`
- `charge.dispute.created`
