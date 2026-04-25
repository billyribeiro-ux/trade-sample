# Production Deployment Runbook

Production deployment is intentionally deferred until a domain and live service
credentials exist. For now, use localhost and Stripe test mode.

When ready:

1. Create production Neon, Vercel Blob, Upstash, Resend, Sentry, and Stripe resources.
2. Set Vercel environment variables.
3. Attach the production domain.
4. Run migrations.
5. Sync live Stripe products and prices.
6. Upload production PDFs.
7. Verify checkout, webhook, library, download, and refund flows.

