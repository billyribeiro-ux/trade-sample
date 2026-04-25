# Incident Response

1. Identify affected workflow: auth, checkout, webhook, download, admin, or email.
2. Check application logs and Stripe event logs.
3. Confirm whether audit log entries exist.
4. Pause risky admin actions if needed.
5. Apply a narrow fix and verify locally.
6. Document follow-up work in the changelog or an ADR.

