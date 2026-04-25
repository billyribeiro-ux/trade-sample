# Stripe Webhook Replay

Webhook events are idempotent by Stripe event ID.

To replay a test event:

```bash
stripe events resend <event_id> --webhook-endpoint <endpoint_id>
```

The app skips events that already have `processed_at`.

