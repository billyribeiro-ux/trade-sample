# Design Tokens

The Trading Store uses one dark theme: deep blue-charcoal surfaces, restrained
contrast, and a single confident blue accent.

## Color

```css
:root {
  --color-background: oklch(13% 0.025 260);
  --color-surface: oklch(17% 0.026 260);
  --color-surface-raised: oklch(21% 0.028 260);
  --color-text: oklch(93% 0.012 255);
  --color-text-muted: oklch(70% 0.018 255);
  --color-text-subtle: oklch(55% 0.02 255);
  --color-border: oklch(28% 0.028 260);
  --color-border-strong: oklch(38% 0.035 260);
  --color-accent: oklch(64% 0.18 255);
  --color-accent-hover: oklch(70% 0.18 255);
  --color-success: oklch(68% 0.14 150);
  --color-warning: oklch(76% 0.16 80);
  --color-danger: oklch(64% 0.18 25);
  --color-focus-ring: oklch(72% 0.18 255);
}
```

## Typography

Inter is used for UI, body, headings, and numbers. JetBrains Mono is reserved
for technical identifiers.

```css
:root {
  --text-xs: clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem);
  --text-base: clamp(1rem, 0.96rem + 0.18vw, 1.0625rem);
  --text-lg: clamp(1.125rem, 1.06rem + 0.26vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.16rem + 0.4vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.34rem + 0.72vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.58rem + 1.2vw, 2.75rem);
  --text-4xl: clamp(2.25rem, 1.8rem + 1.8vw, 3.75rem);
  --text-5xl: clamp(3rem, 2.2rem + 3vw, 5.5rem);
}
```

## Spacing

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 2rem;
  --space-8: 2.5rem;
  --space-9: 3rem;
  --space-10: 4rem;
  --space-11: 5rem;
  --space-12: 6rem;
}
```

## Radius, Elevation, Motion

```css
:root {
  --radius-1: 4px;
  --radius-2: 6px;
  --radius-3: 8px;
  --radius-4: 12px;
  --shadow-raised: 0 12px 40px oklch(0% 0 0 / 0.28);
  --duration-interaction: 200ms;
  --duration-page: 350ms;
  --ease-standard: cubic-bezier(0.32, 0.72, 0, 1);
}
```

## Breakpoints

```css
:root {
  --bp-2xs: 22rem;
  --bp-xs: 30rem;
  --bp-sm: 40rem;
  --bp-md: 48rem;
  --bp-lg: 64rem;
  --bp-xl: 80rem;
  --bp-2xl: 96rem;
  --bp-3xl: 112rem;
  --bp-4xl: 128rem;
}
```

