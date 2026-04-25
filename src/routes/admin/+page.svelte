<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const formatRevenue = $derived(
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.revenueCents / 100),
  );
</script>

<svelte:head>
  <title>Admin - The Trading Store</title>
</svelte:head>

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Admin</p>
    <h1>Admin</h1>
    <p class="lede">Operational overview of revenue, customers, products, and recent activity.</p>
  </header>

  <section class="kpi surface" aria-label="Revenue">
    <div class="kpi-head">
      <span class="label">Total revenue</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    </div>
    <strong class="kpi-value">{formatRevenue}</strong>
  </section>

  <nav class="admin-nav" aria-label="Admin sections">
    <a href="/admin/products" class="nav-card">
      <span class="title">Products</span>
      <span class="muted">Pricing &amp; status</span>
    </a>
    <a href="/admin/customers" class="nav-card">
      <span class="title">Customers</span>
      <span class="muted">Profiles &amp; spend</span>
    </a>
    <a href="/admin/purchases" class="nav-card">
      <span class="title">Purchases</span>
      <span class="muted">Refunds &amp; receipts</span>
    </a>
    <a href="/admin/audit-log" class="nav-card">
      <span class="title">Audit log</span>
      <span class="muted">All operations</span>
    </a>
  </nav>

  <section class="surface recent">
    <header class="recent-head">
      <h2>Recent purchases</h2>
      <a class="link" href="/admin/purchases">View all →</a>
    </header>
    <div class="table-shell">
      <table class="data-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Book</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#if data.purchases.length === 0}
            <tr>
              <td colspan="3" class="muted" style="text-align: center; padding: 2rem;">No recent purchases.</td>
            </tr>
          {:else}
            {#each data.purchases as purchase (purchase.id)}
              <tr>
                <td>{purchase.customerEmail}</td>
                <td>{purchase.productName}</td>
                <td><span class="badge badge-success">{purchase.status}</span></td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </section>
</main>

<style>
  .kpi {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .kpi-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-primary-hover);
  }

  .kpi-head .label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    color: var(--color-text-muted);
    text-transform: uppercase;
  }

  .kpi-value {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
  }

  .admin-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
    gap: 1rem;
  }

  .nav-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.1rem 1.25rem;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    color: var(--color-text-primary);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .nav-card:hover {
    background: var(--color-bg-elevated);
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .nav-card .title {
    font-weight: 600;
    font-size: 1rem;
  }

  .nav-card .muted {
    font-size: 0.85rem;
  }

  .recent {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .recent-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .recent-head h2 {
    font-size: 1.15rem;
    margin: 0;
  }
</style>
