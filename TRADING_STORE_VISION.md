# The Trading Store — Product Vision & Specification

> **Purpose:** This document defines what The Trading Store **is** — the actual product, UX, visual identity, page-by-page experience. Read this in full before writing any UI code.
> **Status:** Source of truth for product intent. Updated only when product direction changes.
> **Companion:** `TRADING_STORE_BUILD_BRIEF.md` is the technical execution plan. This is the product spec.

---

## The One-Liner

**The Trading Store is a sophisticated digital storefront where serious traders buy premium learning material — clean, fast, friction-free.**

## Tagline

**Master the markets. Trade with conviction.**

## The Product in One Paragraph

The Trading Store sells two flagship trading books: a $499 fundamentals title (Book 1) and a $999 advanced title (Book 2). Visitors land on a clean, premium storefront. Two cards. Real prices. No upsell carousel, no email popups, no fake countdown timers. Buying takes three clicks: select book → checkout with Stripe → access your library. Once purchased, the books live in a personal library where customers can re-download anytime. Book 1 is unlimited downloads forever; Book 2 is capped at three lifetime downloads — a deliberate choice to communicate value (this is the more advanced material; treat it carefully).

## Target Customer

Serious retail traders ready to invest in their own education. People who:
- Spend $500+ per year on trading tools and courses
- Read books, not TikToks
- Value craft and quality over volume
- Are tired of trader influencer "courses" that are 80% upsell

## Market Positioning

"The Linear of trading books." Quiet confidence. No hype. The product speaks for itself.

## Non-Goals

- Not a marketplace. Two books, period. No third-party authors.
- Not a community / forum. No Discord, no comments.
- Not a subscription. One-time purchase, lifetime access.
- Not a platform. Just a beautifully built bookstore.
- No upsells, no cross-sells, no "complete your purchase" emails.

---

## The Aesthetic — Modern Minimalist (Linear / Stripe school)

### Visual Direction

Think Linear's settings pages. Stripe's checkout. Vercel's marketing site. The qualities that define the look:

- **Generous whitespace** — content breathes
- **Sharp typography hierarchy** — one heading dominates, supporting text recedes
- **Subtle depth** — soft shadows, not heavy ones; subtle borders, not strong ones
- **Restrained color** — mostly grayscale with a single confident accent
- **Precision spacing** — every gap deliberate, multiples of 4px or 8px
- **No decorative noise** — no gradients on buttons, no shadows on text, no rounded corners over 12px, no animations that don't earn their place

### Theme

**Single dark theme.** No light/dark toggle in v1.0.0 (added later if requested). The dark theme is the default and only mode at launch.

### Color Palette (OKLCH)

Built around a deep blue-charcoal background with a single confident accent. **The exact palette is defined in `docs/DESIGN_TOKENS.md`** — these are the directional notes:

| Token | Direction |
|---|---|
| `--color-background` | Deep near-black with a subtle blue tint, OLED-friendly |
| `--color-surface` | One step lighter than background, used for cards |
| `--color-surface-raised` | Two steps lighter, used for elevated panels |
| `--color-text` | Soft white, never pure white |
| `--color-text-muted` | Mid-gray, comfortable for secondary text |
| `--color-text-subtle` | Lower-contrast gray for tertiary metadata |
| `--color-border` | Just barely visible against surfaces |
| `--color-border-strong` | Slightly more visible for active states |
| `--color-accent` | Confident blue (think Stripe blue / Linear's purple-blue) — used sparingly for CTAs and links |
| `--color-accent-hover` | One step brighter |
| `--color-success` | Green for purchase confirmations |
| `--color-warning` | Amber for download quota warnings |
| `--color-danger` | Red for refund / revocation actions |
| `--color-focus-ring` | Accent-colored, 2px, always visible on keyboard focus |

### Typography

| Use | Font | Notes |
|---|---|---|
| UI / Body | **Inter** | Self-hosted, variable font, weights 400–700 |
| Headings | **Inter** | Tight letter-spacing on display sizes |
| Numbers / Prices | **Inter** with `font-feature-settings: 'tnum'` | Tabular numerals so prices align |
| Code / Technical | **JetBrains Mono** | If we ever show order confirmation IDs etc. |

**No Google Fonts CDN.** All fonts self-hosted in `static/fonts/`.

### Type scale (fluid via `clamp()`)

| Token | Use |
|---|---|
| `--text-xs` | Metadata, small labels |
| `--text-sm` | Secondary text, captions |
| `--text-base` | Body |
| `--text-lg` | Larger body, lead paragraphs |
| `--text-xl` | Subheadings |
| `--text-2xl` | Section headings |
| `--text-3xl` | Page headings |
| `--text-4xl` | Hero secondary lines |
| `--text-5xl` | Hero primary line |

Exact values (clamped between mobile and desktop) defined in `DESIGN_TOKENS.md`.

### Spacing

8px-based scale, fluid via `clamp()` between breakpoints. Tokens `--space-1` through `--space-12`.

### Motion

- **Default duration:** 200ms (interactions)
- **Page transitions:** 350ms
- **Easing:** `cubic-bezier(0.32, 0.72, 0, 1)` (Linear's signature easing)
- **Reduced motion:** all non-essential animations disabled when `prefers-reduced-motion: reduce`
- **GSAP** lazy-loaded only for the landing hero (subtle scroll-triggered reveal)
- All other motion uses Svelte's native `transition:` and CSS

### Iconography

Iconify with **Phosphor** for UI (regular weight by default, bold for emphasis). Carbon icons reserved for dense data views in admin if needed.

Common icons:
- `ph:download` — download CTA
- `ph:check-circle` — success states
- `ph:warning-circle` — quota warnings
- `ph:x-circle` — errors
- `ph:user-circle` — account
- `ph:books` — library
- `ph:gear` — settings
- `ph:lock-key` — security
- `ph:credit-card` — billing
- `ph:receipt` — purchases

---

## Site Map

### Public

- `/` — Landing
- `/books/[slug]` — Book detail (Book 1, Book 2)
- `/checkout/success` — Post-purchase landing
- `/checkout/cancel` — Cancel landing
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/reset-password/[token]`
- `/auth/verify-email/[token]`
- `/auth/magic-link/[token]`
- `/legal/terms` — Terms of service
- `/legal/privacy` — Privacy policy
- `/legal/refunds` — Refund policy

### Authenticated (customer)

- `/library` — Purchased books with download CTAs
- `/account` — Profile (email, name, change password)
- `/account/security` — Sessions, sign out everywhere
- `/account/purchases` — Purchase history with Stripe receipt links

### Admin (gated by `admin.access`)

- `/admin` — Overview dashboard
- `/admin/products` — Product management
- `/admin/products/[slug]/edit` — Edit + upload PDFs
- `/admin/customers` — Customer search
- `/admin/customers/[id]` — Customer detail with grant/revoke
- `/admin/purchases` — Purchase list with refund actions
- `/admin/audit-log` — System audit log

---

## Page-by-Page Specification

### `/` — Landing Page

**Purpose:** Convey quality, list the two books, drive to purchase.

**Above the fold:**
- Hero section — single line: *"Master the markets. Trade with conviction."*
- Sub-line: short paragraph about the philosophy of the books (lorem ipsum for now, Billy will write later)
- A subtle GSAP scroll-triggered reveal as content enters the viewport
- No CTA button in the hero — let the books themselves be the CTA

**Books section:**
- Two large cards side-by-side (stacked on mobile)
- Each card: cover image, title, one-paragraph description, price, "Learn more →" link
- Hover state: subtle lift + accent border
- Click anywhere on the card → `/books/[slug]`

**Trust section:**
- Three brief trust signals in a row:
  - "Lifetime access" (with lock icon)
  - "Secure checkout via Stripe" (with shield icon)
  - "Instant download after purchase" (with download icon)
- No fake testimonials. No fake numbers. Real signals only.

**Footer:**
- Minimal: links to Terms, Privacy, Refund Policy, Contact email
- Copyright line
- No newsletter signup. No social links unless real ones exist.

**What's NOT on this page:**
- No popup
- No countdown timer
- No "limited offer"
- No comparison table
- No "frequently asked questions" section (overused)
- No multi-step funnel hooks

### `/books/[slug]` — Book Detail Page

**Layout:** Two columns on desktop, stacked on mobile.

**Left column (60%):**
- Large book cover image
- Below cover: short metadata strip (e.g. "Digital PDF · ~XX pages · Lifetime access")

**Right column (40%):**
- Book title (`text-3xl`)
- Subtitle / tagline (`text-lg`, muted)
- Long description (4–6 paragraphs of lorem ipsum for now)
- Price displayed prominently (`text-4xl`, tabular numerals)
- Primary CTA: "**Buy Now — $499**" (or $999) — accent-colored button
- Secondary line below CTA: "Lifetime access · Instant download · Secure checkout via Stripe"
- For Book 2 specifically: small note "*This title is limited to 3 downloads per account due to its premium nature.*"

**Below fold:**
- "What you'll learn" — 5–8 bullet points with check icons
- "Who this is for" — 3 short paragraphs
- About the author — single paragraph + small headshot (placeholder for now)

### Checkout flow (Stripe-hosted)

**Trigger:** "Buy Now" click

**If unauthenticated:**
- Redirect to `/auth/sign-up?intent=purchase&product=<slug>`
- After signup → automatically resume checkout

**If authenticated:**
- Server creates Stripe Checkout Session
- Browser redirects to Stripe-hosted Checkout
- Stripe Checkout is themed via Stripe Dashboard to match (dark mode + accent color)
- After payment → Stripe redirects to `/checkout/success?session_id=...`

### `/checkout/success`

**On arrival:**
- Server verifies `session_id` via Stripe API
- If `payment_status === 'paid'` AND purchase row exists in DB → show success state immediately
- If paid but webhook hasn't fired yet → show "Processing your purchase..." with auto-refresh every 2 seconds (max 30 seconds, then show error fallback)

**Success state:**
- Large green checkmark
- Heading: "Welcome to your library."
- Sub-line: "*Book Title* is ready to download."
- Primary CTA: "**Go to library →**"
- Secondary line: "A receipt has been emailed to *email@example.com*"
- Subtle confetti animation on first arrival (subtle = no full-screen takeover, just a brief 1-second burst near the checkmark)

### `/checkout/cancel`

- Heading: "Checkout canceled."
- Sub-line: "No charge was made. You can try again anytime."
- CTA: "**Return to store →**"
- Optional second line: "Have questions? Contact us at *support@thetradingstore.com*"

### `/library` — Member Library (THE most important page)

**Purpose:** This is what customers paid for. It must feel premium and friction-free.

**Layout:**
- Page heading: "Your library"
- Sub-line: "X books · purchased Y, Z"
- Each purchased book displayed as a large card (one per row on mobile, two-column on tablet, configurable on desktop):
  - Cover image (left)
  - Title + purchase date (right)
  - Download policy badge:
    - **Book 1:** "Unlimited downloads" badge in muted green
    - **Book 2:** "X of 3 downloads remaining" — muted amber if 1 left, muted red if 0 left
  - Primary CTA: "**Download**" button with download icon
  - Secondary link: "View receipt" → opens Stripe-hosted invoice URL

**Empty state (no purchases yet):**
- Centered message: "Your library is empty."
- Sub-line: "Browse the store to get started."
- CTA: "**Browse books →**"

**Download click flow:**
1. Button enters loading state with spinner
2. POST to `/api/books/[slug]/download`
3. Response received:
   - **Success:** open returned signed URL in new tab; show toast "Download started"
   - **Quota exceeded (Book 2 only):** show modal with friendly explanation:
     - Heading: "Download limit reached"
     - Body: "You've used all 3 downloads for this book. If you need help, contact support and we can assist."
     - CTA: "Contact support" (mailto link)
     - Cancel: "Close"

### `/account` — Account Settings

Three sections in a vertical layout:

**Profile**
- Email (display only; change requires re-verification)
- Name (editable inline)

**Password**
- Change password form (current + new + confirm)

**Sign out**
- "Sign out of this device"
- "Sign out of all devices" (danger button)

### `/account/security`

- List of active sessions with device + last active timestamp
- Revoke individual sessions
- Two-factor authentication toggle (placeholder UI, actual 2FA not in v1.0.0)

### `/account/purchases`

- Table of all purchases:
  - Date · Book · Amount · Receipt link · Status
- Status values: "Paid" (green), "Refunded" (gray), "Disputed" (red)
- Receipt link → opens Stripe-hosted invoice URL

### Auth pages (`/auth/*`)

All auth pages share a centered card layout on a full-page dark background.

**Sign-in card:**
- Heading: "Welcome back"
- Email field
- Password field with show/hide toggle
- Primary CTA: "**Sign in**"
- Below CTA: "Sign in with magic link instead" link
- Below that: "Don't have an account? **Sign up**"
- Above CTA: "Forgot password?" link

**Sign-up card:**
- Heading: "Create your account"
- Email field
- Password field (with strength indicator)
- Confirm password field
- Primary CTA: "**Create account**"
- Below CTA: "Already have an account? **Sign in**"

**Magic-link request:**
- Heading: "Sign in with email"
- Sub-line: "We'll email you a one-time link."
- Email field
- Primary CTA: "**Send link**"
- Success state: "Check your email — a link is on the way."

### `/admin` — Admin Overview

**KPI cards row (4 across):**
- Total revenue (lifetime + this month)
- Units sold (lifetime, broken down per book)
- Conversion rate (purchases / unique visitors, if analytics available)
- Active customers (with purchases)

**Recent purchases table:**
- Last 20 purchases with: customer email, book, amount, status, date

**Recent activity feed:**
- Last 20 audit log events: who did what, when

### `/admin/products`

- Table of products (active + soft-deleted toggle)
- Each row: cover thumbnail, name, slug, price, status, units sold, "Edit" link
- Top-right: "+ New product" CTA

### `/admin/products/[slug]/edit`

- Two-column form
- Left: text fields (name, description, price, slug, download policy, download limit)
- Right: file upload zones for cover image and book PDF
- Both upload zones drag-drop + click-to-browse
- File uploads go to Vercel Blob with progress indicator
- "Save changes" CTA at bottom

### `/admin/customers`

- Search bar (search by email)
- Table: email, signup date, total spent, # purchases, last active, "View" link

### `/admin/customers/[id]`

- Customer header: email, name, signup date, total revenue
- Tabs: Purchases · Entitlements · Audit
- "Grant entitlement" button → modal: select product, set downloads_allowed (or "unlimited"), submit
- For each entitlement: "Revoke" button with confirmation

### `/admin/purchases`

- Filterable table: date range, status, customer email
- Each row: customer, book, amount, status, date, "Refund" button (only if status === 'completed')
- Refund click → confirmation modal → executes Stripe refund

### `/admin/audit-log`

- Filterable: actor, action, resource type, date range
- Paginated table: timestamp, actor, action, resource, IP

---

## Microcopy & Tone

- Confident, never aggressive
- Short sentences
- No marketing jargon ("disrupt", "revolutionize", "10x", "game-changer", "next-gen")
- No fake urgency ("Only X left!", "Sale ends today!")
- No emoji in product copy (rare exception: success confirmations may use `✓` as a typographic mark, not the emoji)
- Plain English: "Buy now" not "Get instant access"
- Honest: "Refunds within 14 days" not "100% Money-Back Guarantee!!!"
- Address the customer directly: "Your library" not "Customer Library"

### Common phrases standardized

| Action | Copy |
|---|---|
| Primary CTA on book page | "Buy now — $XXX" |
| Loading state on buy button | "Loading checkout..." |
| Library empty state | "Your library is empty." |
| Download button | "Download" |
| Download in progress | "Starting download..." |
| Download success toast | "Download started." |
| Quota exceeded modal heading | "Download limit reached" |
| Refund confirmation | "Refund issued. The customer has been notified." |
| Error generic | "Something went wrong. Please try again." |

---

## Email Tone

All transactional emails follow the same template:
- Clean, plain layout
- The Trading Store wordmark at top (small, muted)
- Single-column body, generous line height
- One primary CTA button if applicable
- Footer with: support email, unsubscribe link (where legally required), small wordmark

**Tone:** Friendly but professional. Direct. No exclamation points except in genuine celebration ("Welcome to your library").

### Email types

| Trigger | Subject | Body summary |
|---|---|---|
| Sign-up | "Verify your email" | "Click below to confirm your email address." |
| Email verification | "Welcome to The Trading Store" | "Your account is ready. Browse books or sign in." |
| Password reset request | "Reset your password" | "Click the link to set a new password. Expires in 1 hour." |
| Magic link request | "Your sign-in link" | "Click to sign in. Expires in 15 minutes." |
| Purchase confirmation | "Your purchase: *Book Title*" | "Thank you. Your book is in your library." Includes receipt link. |
| Refund issued | "Your refund has been processed" | "Refund of $XXX is on its way. It may take 5–10 business days." |
| Manual entitlement grant | "You've been granted access" | "An admin has granted you access to *Book Title*. Find it in your library." |

---

## Mobile Experience

The site is mobile-first in spirit but desktop-first in priority (the buyer is at a desk). Mobile must:

- Render all pages cleanly
- Allow full purchase flow (Stripe Checkout is mobile-optimized)
- Allow full library access including downloads
- Use stacked layouts where two-column doesn't fit
- Preserve readability — body text minimum 16px on mobile
- Touch targets minimum 44x44px

---

## Accessibility

- Every interactive element keyboard-reachable
- Focus rings always visible (never `outline: none` without replacement)
- ARIA labels on icon-only buttons
- Heading hierarchy enforced (no skipping levels)
- `prefers-reduced-motion` respected for all animations
- Contrast ratio: ≥ 4.5:1 for body text, ≥ 3:1 for large text (WCAG AA minimum, AAA where feasible)
- Form errors announced via `aria-live`
- Skip-to-content link on every page

---

## Performance Budget

| Metric | Budget |
|---|---|
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 1.8s |
| Time to Interactive | < 2.5s |
| Total JS (initial) | < 100 KB gzipped |
| Total CSS (initial) | < 30 KB gzipped |
| Library page load | < 800ms p95 |
| Download endpoint response | < 300ms p95 |

GSAP loaded lazily (only on landing). All images served via Vercel's image optimization.

---

## The "Holy Shit" Moments (Demo Reel)

The 3 specific UX experiences that should feel premium:

1. **Library reveal after first purchase** — `/checkout/success` → "Welcome to your library" → click "Go to library" → smooth GSAP transition into a populated library page with the book card animated in. First-time-only confetti burst (1 second, near the success checkmark, no full-screen takeover).

2. **Download click → file in your downloads folder in <2 seconds** — instant feedback, signed URL generation, browser download starts. No "we're preparing your file" stalling. No multi-step modals.

3. **Admin uploading a new PDF version** — drag-drop the file → progress bar → "Uploaded" → existing customers' next download serves the new file. Zero friction. The kind of thing that makes you go "damn, this is well-built."

---

## What Makes It Premium for $499 / $999

For a $499 or $999 product, customers expect a certain quality bar. The Trading Store delivers it through:

1. **Visual restraint** — looks expensive because it doesn't try to look expensive
2. **Speed** — every interaction sub-300ms
3. **Clear pricing** — no hidden fees, no upsells, no "but wait there's more"
4. **Real download protection** — Book 2's 3-download cap signals "this matters"
5. **Stripe Checkout** — customers recognize it and trust it
6. **Real refund policy** — 14 days, no questions, automated process
7. **Clean library** — feels like a curated bookshelf, not a download dump
8. **Premium emails** — not ALL CAPS shouty subject lines

---

## Branding Quick Reference

| Asset | Detail |
|---|---|
| Product name | The Trading Store |
| Tagline | Master the markets. Trade with conviction. |
| Domain | TBD |
| Wordmark | "The Trading Store" set in Inter, custom kerning, single-line lockup |
| Typography | Inter (UI), JetBrains Mono (technical) |
| Colors | Deep blue-charcoal background + confident blue accent (full palette in `DESIGN_TOKENS.md`) |
| Favicon | Single letter "T" or simple geometric mark — to be designed |

---

## Forbidden UI Patterns

These never appear in The Trading Store:

- Tailwind utility classes
- Emojis in product copy
- Modals without keyboard escape
- Actions without keyboard shortcuts (where applicable)
- Dark patterns (deceptive trials, hidden cancellation)
- Google Fonts CDN
- Third-party analytics with PII
- Newsletter signup popups
- Exit-intent modals
- Countdown timers
- Fake stock counters ("Only 5 left!")
- Auto-playing videos
- Carousels (especially auto-advancing ones)
- "As featured in" logos that aren't real

---

## Success Metrics (Post-Launch)

- **Conversion rate** — visitors → purchases. Target: 2%+ for industry-typical traffic.
- **Library re-visit rate** — % of customers who download more than once. Target: 60%+ within 30 days.
- **Refund rate** — purchases refunded within 14 days. Target: < 5%.
- **Support tickets per 100 purchases** — Target: < 3.
- **Time to first download** — minutes from purchase to first download. Target: < 5 min.

---

## Final Word

The Trading Store is a small product built to a high standard. Two books. One bookstore. Built right.

When in doubt: less, not more. Quiet, not loud. Confident, not desperate.

When code disagrees with this document, the code is wrong — or this document needs an update via PR with rationale.

---

<sub>The Trading Store — Product Vision v1.0 — 2026-04-24</sub>
