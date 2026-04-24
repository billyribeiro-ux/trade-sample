# The Trading Store — Claude Code Build Brief

> **Purpose:** Complete autonomous build directive for **The Trading Store** — a digital bookstore selling two downloadable trading books, built to **PE7 (Principal Engineer ICT Level 7)** standards.
>
> **How to use:** Place this file at `docs/handoffs/TRADING_STORE_BUILD_BRIEF.md` in a fresh git repo. Open Claude Code in that repo. Send: *"Read `docs/handoffs/TRADING_STORE_VISION.md` and `docs/handoffs/TRADING_STORE_BUILD_BRIEF.md` in full, then execute autonomously."*
>
> **Read the companion file `TRADING_STORE_VISION.md` first.** That document is the product spec — what the app actually IS, looks like, and feels like. This document is the technical execution plan. Both are required.

---

## 1. Product Definition

**The Trading Store** is a single-purpose digital storefront selling two downloadable trading books as one-time purchases. Customers create accounts, complete checkout, and access a member library where they can re-download their purchases. An admin dashboard manages products, customers, refunds, and audit history.

This is a **learning project** — the goal is to ship a complete PE7-quality SaaS following the exact 14-phase sequence. The book content is placeholder; what's being built is the engineering.

| # | Price | Title | Filename | Download Policy |
|---|---|---|---|---|
| 1 | **$499** | Book 1 | `book-1.pdf` | **Unlimited re-downloads** for the lifetime of the account |
| 2 | **$999** | Book 2 | `book-2.pdf` | **3 lifetime downloads maximum** per user |

Titles, descriptions, and prices live in the database — they are **data**, not code. Editable via admin dashboard at any time without a deploy.

**Branding:** Modern minimalist (Linear / Stripe school). See `TRADING_STORE_VISION.md`.

**Domain:** TBD. Local dev runs at `http://localhost:5173`. Production URL set in Vercel env vars when domain acquired. **`PUBLIC_APP_URL` in `.env.example` shows local value only — never commit fake production URLs.**

---

## 2. Non-Negotiable Standards

1. **TypeScript strict mode** — `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`. Zero `any`, zero `@ts-ignore`, zero warnings.
2. **Production-grade code only** — no `// TODO` placeholders, no shortcuts. Lorem ipsum *content* OK; lorem ipsum *implementations* not OK.
3. **PE7 CSS Architecture** — OKLCH tokens, `@layer` cascade, logical properties, `clamp()` fluid type, native nesting, **zero Tailwind**, 9-tier breakpoints.
4. **Svelte 5 runes only** — `$state`, `$derived`, `$effect`, `$props`, `$bindable`. Snippets + `{@render}`, never slots. Native events. `$app/state`, never `$app/stores`.
5. **pnpm exclusive** — never npm, yarn, bun.
6. **Iconify only** — Phosphor + Carbon. Never Lucide. Never Heroicons.
7. **All Vercel ecosystem** — Vercel hosting, Vercel Blob, Neon (Vercel-integrated), Vercel env vars. One platform.
8. **10-year longevity** — every dep is permanent debt.
9. **Conventional Commits** with `Phase: N` and `Refs: PE7-<AREA>` footers.
10. **Server-authoritative everything**.
11. **Dynamic pricing from DB** — Stripe is a processor, not a pricing source.
12. **Zero hardcoded URLs** — read from `$env/dynamic/public`.
13. **Zero secrets in code** — `.env` (gitignored) for local; Vercel env vars for production.

---

## 3. The Stack — All Vercel

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Meta-framework | SvelteKit | 2.57.x | Vercel adapter |
| UI compiler | Svelte | 5.55.x | Runes-only |
| Language | TypeScript | 5.7+ strict | |
| Build | Vite | 8.x | |
| Runtime | Node.js | 22 LTS | |
| Package manager | pnpm | 10.x | Exclusive |
| Database | Neon Postgres (Vercel-integrated) | — | |
| DB driver | `@neondatabase/serverless` | 1.0.x | |
| ORM | Drizzle ORM | 0.44.x | + `drizzle-kit` |
| Auth | Better Auth | 1.6.x | Email + password + magic link only |
| Validation | Valibot | 1.x | |
| Forms | sveltekit-superforms | 2.30.x | Valibot adapter |
| UI primitives | Bits UI | 2.17.x | Headless, Svelte 5 native |
| Styling | PE7 CSS Architecture | — | OKLCH, `@layer`, **zero Tailwind** |
| Icons | Iconify (`@iconify/svelte`) | — | Phosphor + Carbon only |
| Animation | Svelte native + GSAP 3.x | — | GSAP lazy-loaded for hero |
| Payments | Stripe | 22.x | One-time payments (`mode: 'payment'`) |
| Email | Resend | — | |
| **File storage** | **`@vercel/blob`** | — | **Private blobs with signed read URLs (15-min expiry)** |
| Cache / rate limit | Upstash Redis (Vercel-integrated) | — | |
| Observability | Sentry + Pino | — | |
| Lint + Format | Biome | 2.x | |
| Git hooks | lefthook | — | |
| Testing unit | Vitest | 3.x | Browser mode |
| Testing E2E | Playwright | 1.50+ | |
| Commit linting | commitlint | — | |
| Secret scanning | gitleaks | — | |
| Svelte MCP | `@sveltejs/mcp` | — | `npx sv add mcp` |
| Deploy | Vercel | — | `@sveltejs/adapter-vercel` 5.x |

**Not in stack:** Cloudflare anything, AWS S3 / `@aws-sdk/*`, Tauri, passkeys, 2FA, AI, real-time.

---

## 4. Storage Architecture (Vercel Blob)

### Why Vercel Blob

- One platform — Vercel hosting + storage + env in one dashboard
- Native SvelteKit + Vercel integration via `@vercel/blob`
- Private blobs with signed read URLs
- `BLOB_READ_WRITE_TOKEN` auto-injected by Vercel into preview + production

### Protected download flow

```
Admin uploads book-1.pdf, book-2.pdf via admin dashboard → stored as PRIVATE blobs
products.file_blob_pathname = 'books/book-1.pdf'

Customer pays → webhook checkout.session.completed → purchase + entitlement created

Customer clicks Download:
  POST /api/books/[slug]/download
    1. requireAuth
    2. requireEntitlement (lifetime check)
    3. checkDownloadQuota (3-cap on Book 2)
    4. Generate signed Vercel Blob URL (15 min)
    5. Atomic: increment downloads_used + insert download_log + insert audit_log
    6. Return { url, expires_at, downloads_remaining }

Browser downloads from signed URL → URL expires 15 min later
```

### Two policies enforced server-side

| Book | Policy | Implementation |
|---|---|---|
| Book 1 ($499) | Unlimited | Entitlement check + audit log; no counter |
| Book 2 ($999) | 3 lifetime | Counter on `entitlements.downloads_used`; block when `>= downloads_allowed` |

Policies are **data**: each `products` row has `download_policy` (`'unlimited'` | `'capped'`) and `download_limit` (integer | null).

### Storage module

`src/lib/server/storage/blob.ts`:

```ts
import { put, head, del } from '@vercel/blob';

export async function uploadProductFile(pathname: string, body: Buffer | ReadableStream, contentType: string): Promise<{ pathname: string; url: string }>;
export async function generateSignedDownloadUrl(pathname: string, expiresInSeconds?: number): Promise<{ url: string; expiresAt: Date }>;
export async function deleteProductFile(pathname: string): Promise<void>;
```

Install: `pnpm add @vercel/blob`

### Env vars

```bash
BLOB_READ_WRITE_TOKEN=
```

---

## 5. The Build Log Rule (Critical)

`docs/BUILD_LOG.md` is the project's memory. **Every file you create, modify, or delete must be logged in sequence.**

### After every `git commit`:

1. Get short SHA: `git rev-parse --short HEAD`
2. Append one row per file from that commit to `docs/BUILD_LOG.md` under the current phase section.
3. Format: `| # | YYYY-MM-DD | Phase | \`path/to/file\` | abc1234 | full conventional commit subject |`
4. Commit `BUILD_LOG.md` as its own follow-up commit:
   ```
   docs(log): record <files> in build log

   Phase: N
   Refs: PE7-LOG
   ```
5. Log THAT commit too — it's recursive, the log commit gets a row.

### Build log structure

```markdown
# The Trading Store — Build Log

> Strict chronological log. Append-only. Never reorder. Never delete.

## Phase 0 — Foundation

| # | Date | Phase | File | Commit | Subject |
|---|---|---|---|---|---|
| 1 | 2026-04-24 | 0 | `README.md` | abc1234 | docs: add project README |
...

## Phase 1 — Database Schema

| # | Date | Phase | File | Commit | Subject |
|---|---|---|---|---|---|
| 1 | ... |
```

When a phase closes, add a new heading and reset row numbering.

### Milestone tags table

At the bottom of `BUILD_LOG.md`:

```markdown
## Milestone Tags

| Tag | Date | Phase | Commit | Description |
|---|---|---|---|---|
| v0.1.0 | 2026-04-24 | 0 | abc1234 | Phase 0: Foundation complete |
```

### If you forget to log a file

Stop. Do not proceed. Next commit must reconcile `BUILD_LOG.md` with reality. Velocity does not justify a broken log.

---

## 6. The 14-Phase PE7 Sequence

Strict topological order. Never skip. Never reorder.

```
Phase 0  → Foundation & Environment
Phase 1  → Database Schema
Phase 2  → Database Seeding
Phase 3  → Authentication
Phase 4  → RBAC & Permissions
Phase 5  → Validation & Security
Phase 6  → Core CRUD (Products, Purchases, Downloads)
Phase 7  → Email Service
Phase 8  → Stripe Foundation
Phase 9  → Purchase Services & Webhooks
Phase 10 → Stripe & Plan Seeding
Phase 11 → Storefront & Checkout
Phase 12 → Member Dashboard
Phase 13 → Admin Dashboard
Phase 14 → Testing & CI/CD → release v1.0.0
```

### After each phase

1. Bump `package.json` version.
2. Update `CHANGELOG.md`.
3. Update `ROADMAP.md`.
4. Update `BUILD_LOG.md` milestone table.
5. Tag: `git tag -a vX.Y.Z -m "..."`
6. Push tag.
7. Create GitHub Release.

---

## Phase 0 — Foundation

Files (each its own commit + BUILD_LOG entry):

1. `README.md` — overview, stack, getting started
2. `LICENSE` — MIT
3. `.gitignore` — comprehensive
4. `.env.example` — every var organized by phase
5. `CHANGELOG.md` — Keep a Changelog 1.1.0
6. `SECURITY.md`
7. `CONTRIBUTING.md`
8. `CODE_OF_CONDUCT.md` — Contributor Covenant 2.1 (curl from official source)
9. `.github/PULL_REQUEST_TEMPLATE.md`
10. `.github/ISSUE_TEMPLATE/bug_report.md`
11. `.github/ISSUE_TEMPLATE/feature_request.md`
12. `.github/ISSUE_TEMPLATE/config.yml`
13. `ROADMAP.md`
14. `ARCHITECTURE.md` — system design including Vercel Blob storage flow, RBAC, dynamic pricing
15. **`docs/DESIGN_TOKENS.md`** — complete design system spec (full OKLCH palette per VISION's modern-minimalist direction, type scale, spacing scale, elevation, radius, motion, focus ring, breakpoints)
16. `docs/adr/000-template.md`
17. `docs/adr/001-stack-all-vercel.md` — accept full Vercel ecosystem
18. `docs/adr/002-storage-vercel-blob.md`
19. `docs/adr/003-payments-one-time-not-subscription.md`
20. `docs/adr/004-download-policy-data-not-code.md`
21. `docs/adr/005-design-system-before-ui.md`
22. `docs/BUILD_LOG.md` — initialized
23. `biome.json` — PE7 standards (2-space, 100 width, single quotes, trailing comma all, semicolons)
24. `lefthook.yml` — pre-commit hooks
25. `commitlint.config.js`
26. `.gitleaks.toml`
27. `tsconfig.json` — strict
28. `package.json` — `packageManager: "pnpm@10.x"`

### CI/CD

`.github/workflows/ci.yml` — lint → type check → test → build on every PR. Vercel preview deploys via auto-integration.

Tag `v0.1.0`.

---

## Phase 1 — Database Schema

### Steps

1. **Scaffold:**
   ```bash
   pnpm dlx sv@latest create .
   # SvelteKit minimal, TypeScript syntax, Vitest, Playwright
   # Skip ESLint + Prettier (using Biome)
   # Preserve existing files
   ```

2. **Vercel adapter:** `pnpm add -D @sveltejs/adapter-vercel@latest`
3. **Svelte MCP:** `pnpm dlx sv add mcp`
4. **DB:** `pnpm add drizzle-orm @neondatabase/serverless` and `pnpm add -D drizzle-kit`
5. **Vercel Blob:** `pnpm add @vercel/blob`

### Schema directory

```
src/lib/server/db/
├── index.ts
└── schema/
    ├── index.ts
    ├── auth.ts          # users, sessions, accounts, verification
    ├── rbac.ts          # roles, role_assignments
    ├── products.ts      # products, prices
    ├── purchases.ts
    ├── entitlements.ts
    ├── downloads.ts     # download_log
    ├── webhooks.ts      # webhook_events
    └── audit.ts         # audit_log
```

### Schema detail

**`products`**
- `id uuid pk default gen_random_uuid()`
- `slug text unique not null`
- `name text not null`
- `description text`
- `cover_image_blob_pathname text`
- `file_blob_pathname text not null`
- `download_policy text not null` — `'unlimited'` | `'capped'`
- `download_limit integer`
- `is_active boolean default true`
- `stripe_product_id text`
- `created_at`, `updated_at`, `deleted_at`

**`prices`**
- `id uuid pk`
- `product_id uuid fk products`
- `amount_cents integer not null`
- `currency text default 'usd'`
- `stripe_price_id text`
- `is_active boolean default true`
- `created_at`

**`purchases`**
- `id uuid pk`
- `user_id uuid fk users`
- `product_id uuid fk products`
- `price_id uuid fk prices`
- `amount_paid_cents integer not null`
- `currency text not null`
- `stripe_checkout_session_id text unique not null`
- `stripe_payment_intent_id text unique not null`
- `status text not null` — `'completed'` | `'refunded'` | `'disputed'`
- `purchased_at timestamptz not null`
- `refunded_at timestamptz`
- `created_at`

**`entitlements`**
- `id uuid pk`
- `user_id uuid fk users`
- `product_id uuid fk products`
- `purchase_id uuid fk purchases` — null if manual grant
- `granted_at timestamptz not null`
- `revoked_at timestamptz`
- `downloads_allowed integer` — null if unlimited
- `downloads_used integer not null default 0`
- Unique partial index: `(user_id, product_id) where revoked_at is null`

**`download_log`**
- `id uuid pk`
- `user_id uuid fk users`
- `product_id uuid fk products`
- `entitlement_id uuid fk entitlements`
- `ip_address inet`
- `user_agent text`
- `signed_url_expires_at timestamptz not null`
- `created_at`

**`webhook_events`**
- `id text pk` — Stripe event ID
- `type text not null`
- `payload jsonb not null`
- `processed_at timestamptz`
- `created_at`

**`audit_log`**
- `id uuid pk`
- `actor_id uuid fk users`
- `action text not null`
- `resource_type text`
- `resource_id uuid`
- `metadata jsonb`
- `ip_address inet`
- `created_at`

### Migration

```bash
pnpm drizzle-kit generate --name=initial_schema
```

Tag `v0.2.0`.

---

## Phase 2 — Database Seeding

### Files

```
drizzle/seed/
├── index.ts
├── personas.ts
├── products.ts
├── permissions.ts
├── purchases.ts
└── reset.ts
```

### Personas

```ts
[
  { email: 'admin@trading.test',     password: 'TestPass!234', role: 'admin'    },
  { email: 'customer1@trading.test', password: 'TestPass!234', role: 'customer', purchases: ['book-1']           },
  { email: 'customer2@trading.test', password: 'TestPass!234', role: 'customer', purchases: ['book-2']           },
  { email: 'customer3@trading.test', password: 'TestPass!234', role: 'customer', purchases: ['book-1', 'book-2'] },
  { email: 'customer4@trading.test', password: 'TestPass!234', role: 'customer', purchases: []                   },
]
```

### Products (lorem ipsum descriptions per Billy)

```ts
[
  {
    slug: 'book-1',
    name: 'Book 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    file_blob_pathname: 'books/book-1.pdf',
    download_policy: 'unlimited',
    download_limit: null,
    price_cents: 49900,
  },
  {
    slug: 'book-2',
    name: 'Book 2',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    file_blob_pathname: 'books/book-2.pdf',
    download_policy: 'capped',
    download_limit: 3,
    price_cents: 99900,
  },
]
```

### Scripts

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate":  "drizzle-kit migrate",
  "db:seed":     "tsx drizzle/seed/index.ts",
  "db:reset":    "tsx drizzle/seed/reset.ts && pnpm db:migrate && pnpm db:seed",
  "db:studio":   "drizzle-kit studio"
}
```

Tag `v0.3.0`.

---

## Phase 3 — Authentication

1. `pnpm add better-auth`
2. Configure with Drizzle adapter + email/password + magic link plugins. **Skip passkeys + 2FA.**
3. `src/hooks.server.ts` — session hydration + route guards
4. Auth UI routes (Bits UI + design tokens):
   - `/auth/sign-in`, `/auth/sign-up`
   - `/auth/forgot-password`, `/auth/reset-password/[token]`
   - `/auth/verify-email/[token]`, `/auth/magic-link/[token]`
   - `/account/security`
5. Audit log every auth event.

Tag `v0.4.0`.

---

## Phase 4 — RBAC & Permissions

### Roles

| Role | Capabilities |
|---|---|
| `admin` | Dashboards, customer list, manual grants, refunds, file uploads, audit log |
| `customer` | Library, downloads, purchase history, account settings |

### Permissions

```ts
type Permission =
  | 'admin.access'
  | 'product.read' | 'product.create' | 'product.update' | 'product.delete'
  | 'purchase.read.own' | 'purchase.read.all' | 'purchase.refund'
  | 'entitlement.grant' | 'entitlement.revoke'
  | 'download.execute'
  | 'audit.read';
```

### Three layers (always all three)

1. Route guard in `hooks.server.ts`
2. Server check at handler — `await requirePermission(locals, 'admin.access')`
3. UI gating (cosmetic only)

Tag `v0.5.0`.

---

## Phase 5 — Validation & Security

1. `pnpm add valibot sveltekit-superforms`
2. `src/lib/schemas/` — one file per domain
3. `pnpm add @upstash/redis @upstash/ratelimit`
4. Rate limits:
   - Sign-in: 5 / 15 min / IP
   - Sign-up: 3 / hour / IP
   - Password reset: 3 / hour / email
   - **Download: 10 / minute / user**
   - Magic link: 3 / hour / email
5. CSP headers (allow `js.stripe.com`, `*.public.blob.vercel-storage.com`, `api.resend.com`)
6. Centralized errors: `ValidationError`, `PermissionError`, `NotFoundError`, `RateLimitError`, `EntitlementError`, `DownloadQuotaExceededError`

Tag `v0.6.0`.

---

## Phase 6 — Core CRUD

### Endpoints

**Products (admin)**
- `GET    /api/admin/products`
- `POST   /api/admin/products`
- `GET    /api/admin/products/[slug]`
- `PATCH  /api/admin/products/[slug]`
- `DELETE /api/admin/products/[slug]`
- `POST   /api/admin/products/[slug]/upload-file`
- `POST   /api/admin/products/[slug]/upload-cover`

**Products (public)**
- `GET    /api/products`

**Purchases (member)**
- `GET    /api/purchases`
- `GET    /api/purchases/[id]`

**Purchases (admin)**
- `GET    /api/admin/purchases`
- `POST   /api/admin/purchases/[id]/refund`

**Downloads**
- `POST   /api/books/[slug]/download`

### Download algorithm

```
POST /api/books/[slug]/download
  1. requireAuth
  2. Load product by slug
  3. Load active entitlement → 403 if none
  4. If capped + downloads_used >= download_limit → 429 quota error
  5. Generate signed Vercel Blob URL (15 min)
  6. Transaction:
     a. UPDATE entitlements SET downloads_used = downloads_used + 1
     b. INSERT download_log
     c. INSERT audit_log
  7. Return { url, expires_at, downloads_remaining }
```

### Storage module

`src/lib/server/storage/blob.ts` with `uploadProductFile`, `generateSignedDownloadUrl`, `deleteProductFile`.

Tag `v0.7.0`.

---

## Phase 7 — Email Service

1. `pnpm add resend`
2. Templates (Svelte SSR):
   - `WelcomeEmail`, `VerifyEmail`, `PasswordReset`, `MagicLink`
   - `PurchaseConfirmation`, `RefundIssued`
   - `EntitlementGranted` — for manual admin grants
3. `sendEmail({ to, template, data })` with retry + bounce
4. Links use `$env/dynamic/public` for app URL

Tag `v0.8.0`.

---

## Phase 8 — Stripe Foundation

1. `pnpm add stripe`
2. Lazy client factory in `src/lib/server/stripe/client.ts`
3. Webhook endpoint at `/api/webhooks/stripe` — raw body, signature verification, `webhook_events` idempotency
4. Document `stripe listen --forward-to localhost:5173/api/webhooks/stripe`

Tag `v0.9.0`.

---

## Phase 9 — Purchase Services & Webhooks

### Handlers

```
checkout.session.completed   → insert purchase + grant entitlement + send confirmation
payment_intent.payment_failed → log
charge.refunded              → mark refunded + revoke entitlement + send refund email
charge.dispute.created       → mark disputed + revoke entitlement + alert admin
```

### Purchase processor

```ts
async function processCheckoutCompleted(session: Stripe.Checkout.Session) {
  await db.transaction(async (tx) => {
    // 1. Insert purchase
    // 2. Insert entitlement (downloads_allowed from product policy)
    // 3. Insert audit_log
    // 4. Mark webhook_events.processed_at
  });
  // 5. Send purchase confirmation email
}
```

Idempotency: every handler checks `webhook_events.processed_at` first.

Tag `v0.10.0`.

---

## Phase 10 — Stripe & Plan Seeding

### Sync script

`drizzle/seed/stripe-sync.ts`:
1. Load products from DB
2. Create or update Stripe products, save `stripe_product_id` back
3. Load prices from DB
4. Create Stripe prices (immutable), save `stripe_price_id` back

### Scripts

```json
{
  "stripe:sync":   "tsx drizzle/seed/stripe-sync.ts",
  "stripe:listen": "stripe listen --forward-to localhost:5173/api/webhooks/stripe"
}
```

Runbook: `docs/runbooks/stripe-testing.md`

Tag `v0.11.0`.

---

## Phase 11 — Storefront & Checkout

See `TRADING_STORE_VISION.md` for UX. Pages:

- `/` — landing
- `/books/[slug]` — book detail
- `/checkout/success` — post-purchase
- `/checkout/cancel` — cancel page

### Checkout flow

```
"Buy Now" → POST /api/checkout
  - If unauthenticated → /auth/sign-up?intent=purchase&product=<slug>
  - If authenticated:
    1. Validate product slug + active
    2. Find or create Stripe Customer (idempotency = user UUID)
    3. Create Stripe Checkout Session:
       - mode: 'payment'  ← ONE-TIME
       - line_items: [{ price: stripe_price_id, quantity: 1 }]
       - success_url: ${PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}
       - cancel_url: ${PUBLIC_APP_URL}/checkout/cancel
       - metadata: { user_id, product_id }
    4. Return session URL
  - Client redirects to Stripe Checkout
```

### Post-purchase reconciliation

`/checkout/success?session_id=xxx` — verify session via Stripe API. If paid but webhook not yet fired, show "Processing..." with auto-refresh. Once purchase exists, redirect to `/library`.

Tag `v0.12.0`.

---

## Phase 12 — Member Dashboard

See `TRADING_STORE_VISION.md`. Pages:

- `/library`
- `/account` (profile, password change)
- `/account/security` (sessions)
- `/account/purchases` (history with Stripe receipt links)

### Download UX

- Click "Download Book 1" → loading → POST → open signed URL in new tab → unlimited
- Click "Download Book 2" → shows "X downloads remaining" before AND after click
- Quota exceeded for Book 2 → friendly modal with support email

Tag `v0.13.0`.

---

## Phase 13 — Admin Dashboard

See `TRADING_STORE_VISION.md`. All gated by `admin.access`. Pages:

- `/admin` — overview (revenue, units, conversion, recent purchases)
- `/admin/products` — list + create + edit + file upload
- `/admin/customers` — search, detail, manual grant/revoke
- `/admin/purchases` — refund button
- `/admin/audit-log` — filterable

### File upload (Vercel Blob)

Admin uploads PDF → `put()` to private blob → update `products.file_blob_pathname` → next download serves new file. Old blob archived 30 days then deleted.

### Manual grant

```
POST /api/admin/users/[user_id]/grant-entitlement
{ product_id, downloads_allowed }
```
Insert entitlement with `purchase_id = null`, audit log, send "You've been granted access" email.

### Refund

```
POST /api/admin/purchases/[id]/refund
  → stripe.refunds.create({ payment_intent: ... })
  → charge.refunded webhook → Phase 9 handler → revoke + email
```

Tag `v0.14.0`.

---

## Phase 14 — Testing & CI/CD

### Coverage

- **Unit (Vitest):** 90%+ on `src/lib/`
- **Integration:** every endpoint with auth + permission + validation matrix
- **E2E (Playwright):**
  - Sign up → verify → land in library
  - Buy Book 1 → unlimited downloads work
  - Buy Book 2 → 3 downloads → 4th blocked
  - Refund → entitlement revoked → blocked
  - Admin: grant entitlement → user downloads
  - Admin: upload new file → next download serves new file

### CI workflow

`.github/workflows/ci.yml`:
- Lint + type check
- Unit + integration against ephemeral Neon branch
- Build
- Playwright E2E (on `main` + on `e2e` label)

### Production setup

1. Neon production project
2. Stripe live + `pnpm stripe:sync` against live key
3. Resend domain verification
4. Vercel project with env vars in Production scope:
   - `DATABASE_URL`, `DATABASE_URL_UNPOOLED`
   - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
   - `STRIPE_SECRET_KEY`, `PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`
   - `BLOB_READ_WRITE_TOKEN` (auto-injected)
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
   - `PUBLIC_APP_URL` (set when domain attached)
5. Sentry linked
6. Initial PDF upload to production Vercel Blob

### Runbooks

- `docs/runbooks/deploy-production.md`
- `docs/runbooks/rollback.md`
- `docs/runbooks/refund-process.md`
- `docs/runbooks/blob-file-replacement.md`
- `docs/runbooks/stripe-webhook-replay.md`
- `docs/runbooks/incident-response.md`
- `docs/runbooks/domain-attachment.md`

### Release v1.0.0

Tag, GitHub Release, deploy.

---

## Conventional Commits Format

```
<type>(<scope>): <subject under 72 chars>

<body wrapped at 100 chars>

Phase: <N>
Refs: PE7-<AREA>
```

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `style`, `build`, `ci`, `revert`.

**Scopes:** `auth`, `db`, `schema`, `seed`, `rbac`, `validation`, `crud`, `email`, `billing`, `stripe`, `checkout`, `library`, `admin`, `storage`, `blob`, `download`, `entitlement`, `ui`, `ci`, `deploy`, `docs`, `test`, `log`.

---

## Communication Protocol

### Stop and ask Billy when

- Real PDFs need uploading
- External account credentials needed (Vercel, Neon, Stripe, Resend, Upstash, Sentry)
- Domain decisions
- Pricing changes

### Execute autonomously when

- Any technical implementation matching this brief and `TRADING_STORE_VISION.md`
- Any operational task
- Any decision already specified

When ambiguous: prefer PE7-aligned interpretation, document in commit body or new ADR, do not stall.

Billy is direct. Don't ask permission for obvious next steps. Don't over-explain. Show the commit and move on.

---

## Final Word

Read `TRADING_STORE_VISION.md` first — that's the product. Then execute every phase here in order. Log every file. Test every flow. Ship `v1.0.0` when Phase 14 closes.

Schema first. Seeds second. Auth third. Stripe never before its dependencies. Server-authoritative everything. Dynamic pricing from DB. Vercel Blob for downloads. Two policies, two products, one storefront, two dashboards, fourteen phases.

**Start with Phase 0. Go.**

---

<sub>The Trading Store v1.0.0 — PE7 Architecture Build Brief — 2026-04-24</sub>
