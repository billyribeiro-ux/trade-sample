# ADR 003: Use One-Time Payments

## Status

Accepted

## Context

The product vision explicitly rejects subscriptions. Customers buy books once
and keep lifetime access according to each product's download policy.

## Decision

Use Stripe Checkout with `mode: payment`. Do not introduce subscription, trial,
or recurring billing objects in v1.

## Consequences

The billing model remains simple and honest. Refund and dispute handling are
still required because purchases affect entitlements.

