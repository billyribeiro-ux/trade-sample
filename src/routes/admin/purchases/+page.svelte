<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let message = $state('');
  let error = $state('');
  let refunding = $state<string | null>(null);

  const money = (amountCents: number, currency: string): string =>
    new Intl.NumberFormat([], {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);

  const formatDate = (value: Date | string | null): string =>
    value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'None';

  async function refundPurchase(id: string): Promise<void> {
    refunding = id;
    message = '';
    error = '';

    const response = await fetch(`/api/admin/purchases/${id}/refund`, { method: 'POST' });
    const result = (await response.json()) as { error?: string; refundId?: string };

    if (!response.ok) {
      error = result.error ?? 'Refund could not be started.';
      refunding = null;
      return;
    }

    message = `Refund started: ${result.refundId}`;
    refunding = null;
  }
</script>

<svelte:head>
  <title>Admin purchases - The Trading Store</title>
</svelte:head>

<main class="page">
  <header>
    <p class="eyebrow">Admin</p>
    <h1>Purchases</h1>
    <p>Search payments, monitor disputes, and initiate Stripe refunds.</p>
  </header>

  <section class="summary" aria-label="Purchase summary">
    <article><span>{data.summary.totalCount}</span><p>Total</p></article>
    <article><span>{data.summary.completedCount}</span><p>Completed</p></article>
    <article><span>{data.summary.refundedCount}</span><p>Refunded</p></article>
    <article><span>{data.summary.disputedCount}</span><p>Disputed</p></article>
    <article><span>{money(data.summary.revenueCents, 'usd')}</span><p>Completed revenue</p></article>
  </section>

  <form class="filters" method="GET">
    <label>
      Search
      <input name="q" placeholder="Email or book" value={data.filters.query} />
    </label>
    <label>
      Status
      <select name="status">
        <option value="">All statuses</option>
        {#each data.purchaseStatuses as status}
          <option value={status} selected={data.filters.status === status}>{status}</option>
        {/each}
      </select>
    </label>
    <button type="submit">Apply</button>
    <a href="/admin/purchases">Reset</a>
  </form>

  {#if message}
    <p class="success" aria-live="polite">{message}</p>
  {/if}
  {#if error}
    <p class="error" aria-live="polite">{error}</p>
  {/if}

  <section class="table-wrap" aria-label="Purchase list">
    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Book</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Purchased</th>
          <th>Stripe</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#each data.purchases as purchase}
          <tr>
            <td>{purchase.customerEmail}</td>
            <td>{purchase.productName}</td>
            <td><span class={`status ${purchase.status}`}>{purchase.status}</span></td>
            <td>{money(purchase.amountPaidCents, purchase.currency)}</td>
            <td>{formatDate(purchase.purchasedAt)}</td>
            <td>
              <span>{purchase.stripePaymentIntentId}</span>
              {#if purchase.receiptUrl}
                <a href={purchase.receiptUrl} target="_blank" rel="noreferrer">Receipt</a>
              {/if}
            </td>
            <td>
              {#if purchase.status === 'completed'}
                <button disabled={refunding === purchase.id} onclick={() => refundPurchase(purchase.id)}>
                  {refunding === purchase.id ? 'Starting...' : 'Refund'}
                </button>
              {:else}
                <span class="muted">{purchase.refundedAt ? formatDate(purchase.refundedAt) : 'No action'}</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</main>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  h1,
  p {
    margin: 0;
  }

  header {
    display: grid;
    gap: 0.5rem;
  }

  header p,
  label,
  .muted {
    color: oklch(70% 0.018 255);
  }

  .eyebrow {
    color: oklch(68% 0.14 150);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: 1rem;
  }

  .summary article,
  .filters,
  .table-wrap {
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  .summary article {
    display: grid;
    gap: 0.25rem;
    padding: 1rem;
  }

  .summary span {
    font-weight: 800;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 1rem;
    padding: 1rem;
  }

  label {
    display: grid;
    gap: 0.4rem;
    min-inline-size: min(100%, 16rem);
    font-size: 0.9rem;
  }

  input,
  select {
    min-block-size: 2.5rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 6px;
    padding-inline: 0.75rem;
    color: oklch(93% 0.012 255);
    background: oklch(13% 0.025 260);
    font: inherit;
  }

  button {
    min-block-size: 2.5rem;
    border: 0;
    border-radius: 6px;
    padding-inline: 1rem;
    color: oklch(13% 0.025 260);
    background: oklch(64% 0.18 255);
    font: inherit;
    font-weight: 700;
  }

  button:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    inline-size: 100%;
    min-inline-size: 58rem;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.75rem;
    border-block-end: 1px solid oklch(28% 0.028 260);
    text-align: start;
    vertical-align: top;
  }

  td span {
    display: block;
    overflow-wrap: anywhere;
  }

  .status {
    display: inline-block;
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    background: oklch(24% 0.032 260);
    color: oklch(80% 0.018 255);
    font-size: 0.8rem;
  }

  .status.completed {
    color: oklch(72% 0.16 150);
  }

  .status.refunded,
  .status.disputed {
    color: oklch(76% 0.16 60);
  }

  a,
  .success {
    color: oklch(70% 0.18 255);
  }

  .error {
    color: oklch(64% 0.18 25);
  }
</style>
