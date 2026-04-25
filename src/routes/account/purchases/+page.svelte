<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const formatDate = (value: Date | string) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));

  const money = (cents: number, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
</script>

<svelte:head>
  <title>Purchases - The Trading Store</title>
</svelte:head>

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Member dashboard</p>
    <h1>Purchases</h1>
    <p class="lede">Every payment associated with your account, including refunds and downloadable receipts.</p>
  </header>

  {#if data.purchases.length === 0}
    <section class="surface empty">
      <h2>No purchases yet</h2>
      <p class="muted">When you complete checkout, your receipts will appear here.</p>
      <a class="btn btn-primary" href="/" style="margin-top: 0.75rem;">Browse books</a>
    </section>
  {:else}
    <section class="table-shell" aria-label="Purchases">
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Book</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {#each data.purchases as purchase (purchase.id)}
            <tr>
              <td>{formatDate(purchase.purchasedAt)}</td>
              <td><strong>{purchase.productName}</strong></td>
              <td class="num">{money(purchase.amountPaidCents, purchase.currency)}</td>
              <td>
                {#if purchase.status === 'completed'}
                  <span class="badge badge-success">{purchase.status}</span>
                {:else if purchase.status === 'refunded'}
                  <span class="badge badge-warning">{purchase.status}</span>
                {:else if purchase.status === 'disputed'}
                  <span class="badge badge-danger">{purchase.status}</span>
                {:else}
                  <span class="badge badge-neutral">{purchase.status}</span>
                {/if}
              </td>
              <td>
                {#if purchase.receiptUrl}
                  <a class="link" href={purchase.receiptUrl} target="_blank" rel="noreferrer">Receipt →</a>
                {:else}
                  <span class="muted">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  {/if}
</main>

<style>
  .empty {
    display: grid;
    gap: 0.5rem;
    place-items: start;
  }

  .empty h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  .empty p {
    margin: 0;
  }
</style>
