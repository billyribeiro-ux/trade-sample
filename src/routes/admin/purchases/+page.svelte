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

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Admin</p>
    <h1>Purchases</h1>
    <p class="lede">Search payments, monitor disputes, and initiate Stripe refunds.</p>
  </header>

  <section class="stat-grid" aria-label="Purchase summary">
    <article class="stat-card"><span class="value">{data.summary.totalCount}</span><span class="label">Total</span></article>
    <article class="stat-card"><span class="value">{data.summary.completedCount}</span><span class="label">Completed</span></article>
    <article class="stat-card"><span class="value">{data.summary.refundedCount}</span><span class="label">Refunded</span></article>
    <article class="stat-card"><span class="value">{data.summary.disputedCount}</span><span class="label">Disputed</span></article>
    <article class="stat-card"><span class="value">{money(data.summary.revenueCents, 'usd')}</span><span class="label">Completed revenue</span></article>
  </section>

  <form class="filter-bar" method="GET">
    <div class="form-group">
      <span class="form-label">Search</span>
      <input name="q" placeholder="Email or book" value={data.filters.query} />
    </div>
    <div class="form-group">
      <span class="form-label">Status</span>
      <select name="status">
        <option value="">All statuses</option>
        {#each data.purchaseStatuses as status (status)}
          <option value={status} selected={data.filters.status === status}>{status}</option>
        {/each}
      </select>
    </div>
    <div class="actions">
      <button class="btn btn-primary" type="submit">Apply</button>
      <a class="btn btn-ghost" href="/admin/purchases">Reset</a>
    </div>
  </form>

  {#if message}
    <p class="success-text" aria-live="polite">{message}</p>
  {/if}
  {#if error}
    <p class="error-text" aria-live="polite">{error}</p>
  {/if}

  <section class="table-shell scroll-x" aria-label="Purchase list">
    <table class="data-table">
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
        {#each data.purchases as purchase (purchase.id)}
          <tr>
            <td>{purchase.customerEmail}</td>
            <td>{purchase.productName}</td>
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
            <td class="num">{money(purchase.amountPaidCents, purchase.currency)}</td>
            <td>{formatDate(purchase.purchasedAt)}</td>
            <td>
              <div class="stripe-cell">
                <code class="stripe-id">{purchase.stripePaymentIntentId}</code>
                {#if purchase.receiptUrl}
                  <a class="link" href={purchase.receiptUrl} target="_blank" rel="noreferrer">Receipt</a>
                {/if}
              </div>
            </td>
            <td>
              {#if purchase.status === 'completed'}
                <button class="btn btn-danger" disabled={refunding === purchase.id} onclick={() => refundPurchase(purchase.id)}>
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
  .scroll-x {
    overflow-x: auto;
  }

  .stripe-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }

  .stripe-id {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    background: var(--color-bg-elevated);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-sm);
    word-break: break-all;
  }
</style>
