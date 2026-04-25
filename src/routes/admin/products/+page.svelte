<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const formatPrice = (cents: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
      cents / 100,
    );
</script>

<svelte:head>
  <title>Products - The Trading Store</title>
</svelte:head>

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Admin</p>
    <h1>Products</h1>
    <p class="lede">Edit pricing, download policy, and listing status for each book.</p>
  </header>

  <section class="table-shell" aria-label="Products">
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Policy</th>
          <th>Status</th>
          <th aria-label="Actions"></th>
        </tr>
      </thead>
      <tbody>
        {#each data.products as product (product.slug)}
          <tr>
            <td><strong>{product.name}</strong></td>
            <td class="num">{formatPrice(product.amountCents)}</td>
            <td>
              {#if product.downloadPolicy === 'unlimited'}
                <span class="badge badge-neutral">Unlimited</span>
              {:else}
                <span class="badge badge-warning">Capped</span>
              {/if}
            </td>
            <td>
              {#if product.isActive}
                <span class="badge badge-success">Active</span>
              {:else}
                <span class="badge badge-danger">Inactive</span>
              {/if}
            </td>
            <td><a class="link" href={`/admin/products/${product.slug}/edit`}>Edit</a></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</main>
