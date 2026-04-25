<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Edit {data.product.name} - The Trading Store</title>
</svelte:head>

<main class="page">
  <h1>Edit {data.product.name}</h1>
  <section>
    <p>Slug: {data.product.slug}</p>
    <p>Price: ${(data.product.amountCents / 100).toFixed(0)}</p>
    <p>Policy: {data.product.downloadPolicy}</p>
    <p>PDF pathname: {data.product.fileBlobPathname}</p>
  </section>
</main>

<style>
  .page { display: grid; gap: 1rem; padding: clamp(2rem, 6vw, 6rem); }
  section { padding: 1rem; border: 1px solid oklch(28% 0.028 260); border-radius: 8px; background: oklch(17% 0.026 260); }
  p { color: oklch(70% 0.018 255); }
</style>

