<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let loading = $state(false);
  let error = $state('');

  const price = $derived(new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(data.product.amountCents / 100));

  async function buy(): Promise<void> {
    loading = true;
    error = '';
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: data.product.slug }),
    });

    if (response.status === 403 || response.status === 401) {
      window.location.href = `/auth/sign-up?intent=purchase&product=${data.product.slug}`;
      return;
    }

    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      error = result.error ?? 'Something went wrong. Please try again.';
      loading = false;
      return;
    }

    window.location.href = result.url;
  }
</script>

<svelte:head>
  <title>{data.product.name} - The Trading Store</title>
</svelte:head>

<main class="book-page container">
  <section class="cover-wrapper">
    <div class="cover">
      <div class="cover-glow"></div>
      <span>{data.product.name}</span>
    </div>
  </section>
  <section class="detail">
    <p class="meta">
      <span class="badge">Digital PDF</span>
      <span class="badge">Lifetime access</span>
      <span class="badge">Secure checkout</span>
    </p>
    <h1>{data.product.name}</h1>
    <p class="subtitle text-gradient">Premium trading material for serious retail traders.</p>
    <div class="description">
      <p>{data.product.description}</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo
        fermentum, pretium est vitae, bibendum sapien.
      </p>
    </div>
    
    <div class="purchase-box">
      <strong>{price}</strong>
      <button class="btn btn-primary" disabled={loading} onclick={buy} style="width: 100%;">
        {loading ? 'Loading checkout...' : `Buy now`}
      </button>
      {#if data.product.downloadPolicy === 'capped'}
        <p class="note">⚠️ This title is limited to 3 downloads per account due to its premium nature.</p>
      {/if}
      {#if error}
        <p class="error">{error}</p>
      {/if}
    </div>
  </section>
</main>

<style>
  .book-page {
    display: grid;
    grid-template-columns: minmax(18rem, 1fr) minmax(18rem, 1fr);
    gap: clamp(3rem, 8vw, 6rem);
    padding-block: clamp(3rem, 8vw, 6rem);
    animation: fade-in-up 0.8s var(--transition-bounce) forwards;
  }

  .cover-wrapper {
    position: relative;
    width: 100%;
    max-width: 32rem;
    margin: 0 auto;
  }

  .cover {
    display: grid;
    aspect-ratio: 3/4;
    place-items: center;
    border-radius: var(--radius-xl);
    background: var(--color-bg-surface);
    color: var(--color-text-primary);
    font-size: 2.5rem;
    font-weight: 800;
    font-family: var(--font-display);
    position: relative;
    overflow: hidden;
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-xl, 0 25px 50px -12px rgb(0 0 0 / 0.5));
  }

  .cover-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent 0%, var(--color-primary-glow) 50%, transparent 100%);
    animation: rotate 15s linear infinite;
    opacity: 0.8;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .cover span {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
    background: var(--color-bg-base);
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(var(--radius-xl) - 2px);
  }

  .detail {
    display: flex;
    flex-direction: column;
    align-content: start;
    gap: 1.5rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .badge {
    background: var(--color-bg-elevated);
    color: var(--color-text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid var(--color-border);
  }

  h1, p {
    margin: 0;
  }

  h1 {
    font-size: clamp(2.5rem, 4vw, 4rem);
    line-height: 1.1;
  }

  .subtitle {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .description {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    line-height: 1.7;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .purchase-box {
    margin-top: 1rem;
    padding: 2rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg-surface);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  strong {
    font-size: 3rem;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
  }

  .btn-primary {
    min-block-size: 3.5rem;
    font-size: 1.125rem;
  }

  .note {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    background: var(--color-bg-elevated);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
  }

  .error {
    color: var(--color-danger);
    font-weight: 500;
  }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 48rem) {
    .book-page {
      grid-template-columns: 1fr;
    }
  }
</style>
