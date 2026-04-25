# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog 1.1.0, and this project adheres to
Semantic Versioning after `v1.0.0`.

## [Unreleased]

### Added

- Added Docker Compose local Postgres on host port `55432` with `pnpm db:up`
  and `pnpm db:down` scripts.
- Added programmatic Drizzle migration script for reliable localhost migrations.
- Added admin customer detail pages with purchase history, entitlement history,
  audit context, and manual entitlement grant/revoke workflows.

### Changed

- Switched runtime and seed database clients to the standard Postgres driver so
  local Postgres and hosted Postgres URLs share the same path.

## [1.0.0] - 2026-04-24

### Added

- Added storefront, book detail pages, Stripe checkout trigger, checkout
  success/cancel states, member library, account pages, and admin dashboards.
- Added protected download endpoint, private Blob streaming, product CRUD,
  purchase APIs, refund endpoint, Stripe webhook processing, Stripe sync script,
  transactional email service, runbooks, and local unit safety tests.

## [0.6.0] - 2026-04-24

### Added

- Added Valibot auth schemas, centralized application errors, CSP headers, and
  optional Upstash-backed rate limit helpers.

## [0.5.0] - 2026-04-24

### Added

- Added RBAC permission checks and admin route guarding.

## [0.4.0] - 2026-04-24

### Added

- Added Better Auth with Drizzle, SvelteKit handler integration, password auth,
  magic links, password reset, and local auth pages.

## [0.3.0] - 2026-04-24

### Added

- Added local seed/reset scripts for roles, permissions, products, prices,
  personas, purchases, and entitlements.
- Added reusable scrypt password hashing for seeded credentials and Better Auth.

## [0.2.0] - 2026-04-24

### Added

- Added SvelteKit 2 / Svelte 5 application scaffold with Vercel adapter.
- Added Drizzle, Neon, and Vercel Blob dependencies.
- Added initial Postgres schema and generated migration for auth, RBAC, products,
  prices, purchases, entitlements, downloads, webhooks, and audit logs.

## [0.1.0] - 2026-04-24

### Added

- Phase 0 foundation scaffolding.
