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

<main class="book-page">
  <section class="cover">{data.product.name}</section>
  <section class="detail">
    <p class="meta">Digital PDF · Lifetime access · Secure checkout</p>
    <h1>{data.product.name}</h1>
    <p class="subtitle">Premium trading material for serious retail traders.</p>
    <p>{data.product.description}</p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo
      fermentum, pretium est vitae, bibendum sapien.
    </p>
    <strong>{price}</strong>
    <button disabled={loading} onclick={buy}>{loading ? 'Loading checkout...' : `Buy now - ${price}`}</button>
    {#if data.product.downloadPolicy === 'capped'}
      <p class="note">This title is limited to 3 downloads per account due to its premium nature.</p>
    {/if}
    {#if error}
      <p class="error">{error}</p>
    {/if}
  </section>
</main>

<style>
  .book-page {
    display: grid;
    grid-template-columns: minmax(18rem, 3fr) minmax(18rem, 2fr);
    gap: clamp(2rem, 6vw, 5rem);
    padding: clamp(2rem, 6vw, 6rem);
  }

  .cover {
    display: grid;
    min-block-size: 34rem;
    place-items: center;
    border-radius: 8px;
    background: oklch(21% 0.028 260);
    color: oklch(70% 0.018 255);
    font-size: 2rem;
    font-weight: 700;
  }

  .detail {
    display: grid;
    align-content: start;
    gap: 1rem;
  }

  .meta,
  .subtitle,
  .note {
    color: oklch(70% 0.018 255);
  }

  h1,
  p {
    margin: 0;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.25rem);
  }

  strong {
    font-size: clamp(2rem, 5vw, 3rem);
    font-variant-numeric: tabular-nums;
  }

  button {
    min-block-size: 3rem;
    border: 0;
    border-radius: 6px;
    color: oklch(13% 0.025 260);
    background: oklch(64% 0.18 255);
    font: inherit;
    font-weight: 700;
  }

  .error {
    color: oklch(64% 0.18 25);
  }

  @media (max-width: 760px) {
    .book-page {
      grid-template-columns: 1fr;
    }
  }
</style>
