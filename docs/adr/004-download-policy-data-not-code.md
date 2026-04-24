# ADR 004: Model Download Policy as Data

## Status

Accepted

## Context

Book 1 is unlimited and Book 2 is capped at three lifetime downloads. Admins may
edit products without deploys.

## Decision

Store `download_policy` and `download_limit` on product records. Entitlements
copy the effective allowance at grant time.

## Consequences

Business rules are inspectable and admin-editable. Download enforcement remains
centralized in server-side services.

