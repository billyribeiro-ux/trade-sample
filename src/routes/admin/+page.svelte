<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Admin - The Trading Store</title>
</svelte:head>

<main class="admin container">
  <h1 class="text-gradient">Admin Dashboard</h1>
  <section class="kpi">
    <div class="kpi-header">
      <h2>Total revenue</h2>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    </div>
    <strong>${(data.revenueCents / 100).toFixed(2)}</strong>
  </section>
  <nav class="admin-nav">
    <a href="/admin/products" class="nav-card">Products</a>
    <a href="/admin/customers" class="nav-card">Customers</a>
    <a href="/admin/purchases" class="nav-card">Purchases</a>
    <a href="/admin/audit-log" class="nav-card">Audit log</a>
  </nav>
  <section class="recent-purchases">
    <h2>Recent purchases</h2>
    <div class="table-container">
      {#if data.purchases.length === 0}
        <p class="empty-text">No recent purchases.</p>
      {:else}
        {#each data.purchases as purchase}
          <div class="purchase-row">
            <span class="email">{purchase.customerEmail}</span>
            <span class="product">{purchase.productName}</span>
            <span class="status badge badge-success">{purchase.status}</span>
          </div>
        {/each}
      {/if}
    </div>
  </section>
</main>

<style>
  .admin {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-block: clamp(3rem, 8vw, 6rem);
    animation: fade-in-up 0.5s ease-out forwards;
  }

  .kpi {
    padding: 2rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    background: var(--color-bg-surface);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: var(--shadow-sm);
  }

  .kpi-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .kpi h2 {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
  }

  .kpi strong {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
  }

  .admin-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .nav-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    color: var(--color-text-primary);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-fast);
  }

  .nav-card:hover {
    background: var(--color-bg-elevated);
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .recent-purchases {
    padding: 2rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    background: var(--color-bg-surface);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .purchase-row {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    align-items: center;
    padding: 1rem;
    background: var(--color-bg-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .email {
    font-weight: 500;
  }

  .product {
    color: var(--color-text-secondary);
  }

  .status {
    justify-self: end;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge-success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-success);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .empty-text {
    color: var(--color-text-muted);
    font-style: italic;
  }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
