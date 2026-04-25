# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog 1.1.0, and this project adheres to
Semantic Versioning after `v1.0.0`.

## [Unreleased]

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
