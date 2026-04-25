<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Products - The Trading Store</title>
</svelte:head>

<main class="page">
  <h1>Products</h1>
  <table>
    <thead><tr><th>Name</th><th>Price</th><th>Policy</th><th>Status</th><th></th></tr></thead>
    <tbody>
      {#each data.products as product}
        <tr>
          <td>{product.name}</td>
          <td>${(product.amountCents / 100).toFixed(0)}</td>
          <td>{product.downloadPolicy}</td>
          <td>{product.isActive ? 'Active' : 'Inactive'}</td>
          <td><a href={`/admin/products/${product.slug}/edit`}>Edit</a></td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  .page { padding: clamp(2rem, 6vw, 6rem); }
  table { inline-size: 100%; border-collapse: collapse; }
  th, td { padding: 0.75rem; border-block-end: 1px solid oklch(28% 0.028 260); text-align: start; }
  a { color: oklch(70% 0.18 255); }
</style>

