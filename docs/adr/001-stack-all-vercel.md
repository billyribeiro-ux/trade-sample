# ADR 001: Use the Vercel Ecosystem

## Status

Accepted

## Context

The product needs hosting, Postgres, file storage, environment variables, and
preview deployments with a small operational footprint.

## Decision

Use Vercel hosting, Vercel Blob, and Vercel-integrated Neon. Avoid AWS,
Cloudflare, and mixed-provider storage in v1.

## Consequences

The stack is cohesive and easier to operate. The project accepts platform
coupling to Vercel in exchange for lower operational overhead.

