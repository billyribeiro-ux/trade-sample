<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let query = $state('');

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

  const formatDate = (date: Date | string | null) =>
    date
      ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
          new Date(date),
        )
      : 'Never';

  const filteredCustomers = $derived(
    data.customers.filter((customer) => customer.email.toLowerCase().includes(query.toLowerCase())),
  );
</script>

<main class="page">
  <header>
    <p>Admin</p>
    <h1>Customers</h1>
  </header>

  <label>
    <span>Search by email</span>
    <input bind:value={query} type="search" placeholder="customer@trading.test" />
  </label>

  <div class="table" role="table" aria-label="Customers">
    <div class="row header" role="row">
      <span>Email</span>
      <span>Joined</span>
      <span>Total spent</span>
      <span>Purchases</span>
      <span>Last purchase</span>
      <span></span>
    </div>

    {#each filteredCustomers as customer}
      <div class="row" role="row">
        <span>
          <strong>{customer.email}</strong>
          {#if customer.name}<small>{customer.name}</small>{/if}
        </span>
        <span>{formatDate(customer.createdAt)}</span>
        <span>{formatMoney(customer.totalSpentCents)}</span>
        <span>{customer.purchaseCount}</span>
        <span>{formatDate(customer.lastPurchaseAt)}</span>
        <a href={`/admin/customers/${customer.id}`}>View</a>
      </div>
    {/each}
  </div>
</main>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  header p,
  h1 {
    margin: 0;
  }

  header p,
  span,
  small {
    color: oklch(70% 0.018 255);
  }

  h1 {
    font-size: clamp(2rem, 1.7rem + 1.2vw, 3rem);
  }

  label {
    display: grid;
    gap: 0.5rem;
    inline-size: min(100%, 28rem);
  }

  input {
    min-block-size: 2.75rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(13% 0.024 260);
    color: oklch(92% 0.014 255);
    padding-inline: 0.875rem;
  }

  .table {
    display: grid;
    overflow-x: auto;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
  }

  .row {
    display: grid;
    grid-template-columns: minmax(16rem, 1.4fr) repeat(4, minmax(8rem, 1fr)) 5rem;
    gap: 1rem;
    align-items: center;
    min-inline-size: 62rem;
    padding: 1rem;
    border-block-start: 1px solid oklch(28% 0.028 260);
  }

  .row:first-child {
    border-block-start: 0;
  }

  .header {
    background: oklch(17% 0.026 260);
    font-size: 0.875rem;
    font-weight: 700;
  }

  strong,
  small {
    display: block;
  }

  a {
    color: oklch(70% 0.18 255);
  }
</style>
