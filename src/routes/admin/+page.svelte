<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Admin - The Trading Store</title>
</svelte:head>

<main class="admin">
  <h1>Admin</h1>
  <section class="kpi">
    <h2>Total revenue</h2>
    <strong>${(data.revenueCents / 100).toFixed(2)}</strong>
  </section>
  <nav>
    <a href="/admin/products">Products</a>
    <a href="/admin/customers">Customers</a>
    <a href="/admin/purchases">Purchases</a>
    <a href="/admin/audit-log">Audit log</a>
  </nav>
  <section>
    <h2>Recent purchases</h2>
    {#each data.purchases as purchase}
      <p>{purchase.customerEmail} · {purchase.productName} · {purchase.status}</p>
    {/each}
  </section>
</main>

<style>
  .admin {
    display: grid;
    gap: 1rem;
    padding: clamp(2rem, 6vw, 6rem);
  }
  .kpi,
  section {
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }
  nav {
    display: flex;
    gap: 1rem;
  }
  a {
    color: oklch(70% 0.18 255);
  }
</style>

