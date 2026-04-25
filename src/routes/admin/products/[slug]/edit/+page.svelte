<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const price = $derived(
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(data.product.amountCents / 100),
  );
</script>

<svelte:head>
  <title>Edit {data.product.name} - The Trading Store</title>
</svelte:head>

<main class="page-shell">
  <a class="back link" href="/admin/products">← Products</a>

  <header class="page-header">
    <p class="eyebrow">Admin</p>
    <h1>{data.product.name}</h1>
    <p class="lede">Read-only product summary. Edit pricing and content via Stripe and Vercel Blob.</p>
  </header>

  <section class="surface details">
    <dl>
      <div>
        <dt>Slug</dt>
        <dd><code>{data.product.slug}</code></dd>
      </div>
      <div>
        <dt>Price</dt>
        <dd>{price}</dd>
      </div>
      <div>
        <dt>Download policy</dt>
        <dd>
          {#if data.product.downloadPolicy === 'unlimited'}
            <span class="badge badge-neutral">Unlimited</span>
          {:else}
            <span class="badge badge-warning">Capped</span>
          {/if}
        </dd>
      </div>
      <div>
        <dt>PDF pathname</dt>
        <dd><code>{data.product.fileBlobPathname}</code></dd>
      </div>
    </dl>
  </section>
</main>

<style>
  .back {
    width: fit-content;
    font-size: 0.9rem;
  }

  .details dl {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
    gap: 1.25rem;
  }

  dt {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
    font-weight: 600;
    margin-bottom: 0.35rem;
  }

  dd {
    margin: 0;
    color: var(--color-text-primary);
    font-size: 1.05rem;
    overflow-wrap: anywhere;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--color-bg-elevated);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-sm);
  }
</style>
