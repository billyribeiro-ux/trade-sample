# ADR 002: Store Product Files in Vercel Blob

## Status

Accepted

## Context

Customers download paid PDF files. The system needs private storage, short-lived
access, and simple integration with Vercel deployments.

## Decision

Store product PDFs and cover assets in Vercel Blob. PDFs are private and served
through signed URLs generated only after entitlement checks.

## Consequences

The application owns authorization and audit logging. Blob URLs are delivery
mechanisms, not permission grants.

