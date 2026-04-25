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

<main class="shell">
  <section class="hero" aria-labelledby="page-title">
    <p class="eyebrow">The Trading Store</p>
    <h1 id="page-title">Master the markets. Trade with conviction.</h1>
    <p class="lede">
      A focused digital bookstore for premium trading material. Two books, real prices,
      secure checkout, and private library access after purchase.
    </p>
  </section>

  <section class="books" aria-label="Books">
    {#each data.products as product}
      <a class="book-card" href={`/books/${product.slug}`}>
        <div class="cover">{product.name}</div>
        <div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <strong>{formatPrice(product.amountCents)}</strong>
          <span>Learn more -></span>
        </div>
      </a>
    {/each}
  </section>

  <section class="trust" aria-label="Trust">
    <p>Lifetime access</p>
    <p>Secure checkout via Stripe</p>
    <p>Instant download after purchase</p>
  </section>
</main>

<style>
  .shell {
    display: grid;
    gap: clamp(3rem, 8vw, 7rem);
    padding: clamp(2rem, 6vw, 6rem);
  }

  .hero {
    inline-size: min(100%, 68rem);
  }

  .eyebrow {
    margin: 0 0 1rem;
    color: oklch(70% 0.018 255);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0;
  }

  h1 {
    max-inline-size: 13ch;
    margin: 0;
    font-size: clamp(3rem, 2.2rem + 3vw, 5.5rem);
    line-height: 0.95;
    letter-spacing: 0;
  }

  .lede {
    max-inline-size: 42rem;
    margin: 1.5rem 0 0;
    color: oklch(70% 0.018 255);
    font-size: clamp(1.125rem, 1.06rem + 0.26vw, 1.25rem);
    line-height: 1.6;
  }

  .books {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: 1rem;
  }

  .book-card {
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 1.25rem;
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
    text-decoration: none;
    transition:
      transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
      border-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .book-card:hover {
    border-color: oklch(64% 0.18 255);
    transform: translateY(-2px);
  }

  .cover {
    display: grid;
    min-block-size: 11rem;
    place-items: center;
    border-radius: 6px;
    background: oklch(21% 0.028 260);
    color: oklch(70% 0.018 255);
    font-weight: 700;
  }

  h2,
  .book-card p {
    margin: 0 0 0.75rem;
  }

  .book-card p {
    color: oklch(70% 0.018 255);
    line-height: 1.5;
  }

  strong {
    display: block;
    margin-block: 1rem;
    font-size: 1.5rem;
    font-variant-numeric: tabular-nums;
  }

  span {
    color: oklch(70% 0.18 255);
  }

  .trust {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1rem;
    color: oklch(70% 0.018 255);
  }
</style>
