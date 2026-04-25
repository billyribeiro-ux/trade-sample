# Refund Process

Refunds are initiated from the admin purchase endpoint or admin UI.

1. Admin requests refund.
2. App calls Stripe Refunds API.
3. Stripe emits `charge.refunded`.
4. Webhook marks the purchase refunded.
5. Webhook revokes active entitlement.
6. App sends refund email.

## Local Test

1. Complete a test checkout with `4242 4242 4242 4242`.
2. Open `/admin/purchases`.
3. Search by customer email or product title.
4. Click `Refund` on a completed purchase.
5. Wait for `charge.refunded` in `pnpm stripe:listen`.
6. Confirm the purchase status changes to `refunded`.
7. Confirm the member library no longer exposes the refunded book.
8. Confirm `/admin/audit-log` contains `purchase.refund_requested` and
   `purchase.refunded`.

Only completed purchases can be refunded. Refunded or disputed purchases should
show no refund action.
