<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Purchases - The Trading Store</title>
</svelte:head>

<main class="page">
  <h1>Purchases</h1>
  <table>
    <thead>
      <tr><th>Date</th><th>Book</th><th>Amount</th><th>Status</th><th>Receipt</th></tr>
    </thead>
    <tbody>
      {#each data.purchases as purchase}
        <tr>
          <td>{new Date(purchase.purchasedAt).toLocaleDateString()}</td>
          <td>{purchase.productName}</td>
          <td>{(purchase.amountPaidCents / 100).toFixed(2)} {purchase.currency.toUpperCase()}</td>
          <td>{purchase.status}</td>
          <td>{#if purchase.receiptUrl}<a href={purchase.receiptUrl}>Receipt</a>{/if}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  .page {
    padding: clamp(2rem, 6vw, 6rem);
  }
  table {
    inline-size: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 0.75rem;
    border-block-end: 1px solid oklch(28% 0.028 260);
    text-align: start;
  }
  a {
    color: oklch(70% 0.18 255);
  }
</style>

