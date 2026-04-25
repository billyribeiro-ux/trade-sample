<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
      amount / 100,
    );
</script>

<svelte:head>
  <title>The Trading Store</title>
  <meta name="description" content="A premium digital storefront for serious trading education." />
</svelte:head>

<main class="shell container">
  <section class="hero" aria-labelledby="page-title">
    <p class="eyebrow">The Trading Store</p>
    <h1 id="page-title">Master the markets.<br/><span class="text-gradient">Trade with conviction.</span></h1>
    <p class="lede">
      A focused digital bookstore for premium trading material. Two books, real prices,
      secure checkout, and private library access after purchase.
    </p>
  </section>

  {#if data.setupRequired}
    <section class="setup" aria-label="Local setup">
      <p>{data.setupMessage}</p>
      <ol>
        <li>Copy <code>.env.example</code> to <code>.env</code>.</li>
        <li>Add a Neon Postgres <code>DATABASE_URL</code> or compatible local Postgres URL.</li>
        <li>Run <code>pnpm db:migrate</code> and <code>pnpm db:seed</code>.</li>
        <li>Restart <code>pnpm dev -- --port 5173</code>.</li>
      </ol>
    </section>
  {:else}
    <section class="books" aria-label="Books">
      {#each data.products as product (product.slug)}
        <a class="book-card" href={`/books/${product.slug}`}>
          <div class="cover">
            <div class="cover-glow"></div>
            <span>{product.name}</span>
          </div>
          <div class="book-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div class="book-meta">
              <strong>{formatPrice(product.amountCents)}</strong>
              <span class="learn-more">Learn more &rarr;</span>
            </div>
          </div>
        </a>
      {/each}
    </section>
  {/if}

  <section class="trust" aria-label="Trust">
    <div class="trust-badge">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      <span>Lifetime access</span>
    </div>
    <div class="trust-badge">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      <span>Secure checkout via Stripe</span>
    </div>
    <div class="trust-badge">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      <span>Instant download after purchase</span>
    </div>
  </section>
</main>

<style>
  .shell {
    display: grid;
    gap: clamp(4rem, 9vw, 7rem);
    padding-block: clamp(3.5rem, 8vw, 6.5rem);
    animation: fade-in-up 0.65s var(--ease-out) both;
  }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero {
    max-width: 68rem;
    text-align: center;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero .eyebrow {
    margin: 0 0 1.75rem;
    animation: fade-in-up 0.6s var(--ease-out) 0.05s both;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.5rem, 4vw + 1rem, 5rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    animation: fade-in-up 0.7s var(--ease-out) 0.12s both;
  }

  .lede {
    max-width: 42rem;
    margin: 1.5rem 0 0;
    color: var(--color-text-secondary);
    font-size: clamp(1.05rem, 1rem + 0.26vw, 1.2rem);
    line-height: 1.65;
    animation: fade-in-up 0.7s var(--ease-out) 0.2s both;
  }

  .books {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr));
    gap: 1.75rem;
    animation: fade-in-up 0.7s var(--ease-out) 0.28s both;
  }

  .setup {
    display: grid;
    gap: 1.5rem;
    max-width: 52rem;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid var(--color-warning-border);
    border-radius: var(--radius-lg);
    background: var(--color-warning-soft);
  }

  .setup p,
  .setup ol {
    margin: 0;
  }

  .setup ol {
    display: grid;
    gap: 0.75rem;
    padding-inline-start: 1.5rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  code {
    color: var(--color-primary-hover);
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: rgba(0,0,0,0.3);
    padding: 0.1rem 0.3rem;
    border-radius: var(--radius-sm);
  }

  .book-card {
    display: grid;
    grid-template-columns: 10rem 1fr;
    gap: 1.75rem;
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.012), transparent 40%),
      var(--color-bg-surface);
    text-decoration: none;
    transition: transform var(--transition-normal), border-color var(--transition-fast),
      box-shadow var(--transition-normal);
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-xs), var(--shadow-inset);
  }

  .book-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-glow);
    opacity: 0;
    transition: opacity var(--transition-slow);
    pointer-events: none;
  }

  .book-card:hover {
    border-color: var(--color-border-hover);
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }

  .book-card:hover::before {
    opacity: 1;
  }

  .cover {
    display: grid;
    min-block-size: 14rem;
    place-items: center;
    border-radius: var(--radius-md);
    background:
      radial-gradient(120% 90% at 0% 0%, rgba(217, 119, 87, 0.18), transparent 55%),
      radial-gradient(120% 90% at 100% 100%, rgba(180, 130, 100, 0.12), transparent 60%),
      var(--color-bg-sunken);
    color: var(--color-text-secondary);
    font-weight: 600;
    font-family: var(--font-display);
    letter-spacing: -0.01em;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-inset);
  }

  .cover-glow {
    position: absolute;
    inset: -40%;
    background: conic-gradient(from 0deg,
      transparent 0%,
      rgba(217, 119, 87, 0.18) 30%,
      transparent 50%,
      rgba(196, 101, 74, 0.14) 78%,
      transparent 100%);
    animation: rotate 18s linear infinite;
    opacity: 0;
    transition: opacity var(--transition-slow);
    filter: blur(8px);
  }

  .book-card:hover .cover-glow {
    opacity: 1;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .cover span {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 1.25rem;
    font-size: 1.05rem;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
  }

  .book-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 2;
  }

  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
  }

  .book-card p {
    margin: 0 0 1.5rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .book-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  strong {
    font-size: 1.5rem;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
  }

  .learn-more {
    color: var(--color-primary-hover);
    font-weight: 500;
    transition: transform var(--transition-fast), color var(--transition-fast);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .book-card:hover .learn-more {
    transform: translateX(3px);
    color: var(--color-primary);
  }

  .trust {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3rem;
    color: var(--color-text-secondary);
    padding-top: 2.5rem;
    border-top: 1px solid var(--color-border);
    animation: fade-in-up 0.7s var(--ease-out) 0.36s both;
  }

  .trust-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .trust-badge svg {
    color: var(--color-primary);
    opacity: 0.85;
  }

  @media (max-width: 48rem) {
    .book-card {
      grid-template-columns: 1fr;
    }
    .cover {
      min-block-size: 16rem;
    }
  }
</style>
