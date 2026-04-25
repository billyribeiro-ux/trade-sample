<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Admin purchases - The Trading Store</title>
</svelte:head>

<main class="page">
  <h1>Purchases</h1>
  <table>
    <tbody>
      {#each data.purchases as purchase}
        <tr>
          <td>{purchase.customerEmail}</td>
          <td>{purchase.productName}</td>
          <td>{purchase.status}</td>
          <td>${(purchase.amountPaidCents / 100).toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  .page { padding: clamp(2rem, 6vw, 6rem); }
  table { inline-size: 100%; border-collapse: collapse; }
  td { padding: 0.75rem; border-block-end: 1px solid oklch(28% 0.028 260); }
</style>

