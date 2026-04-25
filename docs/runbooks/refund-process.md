# Refund Process

Refunds are initiated from the admin purchase endpoint or admin UI.

1. Admin requests refund.
2. App calls Stripe Refunds API.
3. Stripe emits `charge.refunded`.
4. Webhook marks the purchase refunded.
5. Webhook revokes active entitlement.
6. App sends refund email.

