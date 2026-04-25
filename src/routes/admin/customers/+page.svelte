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

<svelte:head>
  <title>Customers - The Trading Store</title>
</svelte:head>

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Admin</p>
    <h1>Customers</h1>
    <p class="lede">Look up customers by email, view spend, and open detail pages to manage entitlements.</p>
  </header>

  <div class="form-group" style="max-width: 28rem;">
    <span class="form-label">Search by email</span>
    <input bind:value={query} type="search" placeholder="customer@trading.test" />
  </div>

  <section class="table-shell" aria-label="Customers">
    <table class="data-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Joined</th>
          <th>Total spent</th>
          <th>Purchases</th>
          <th>Last purchase</th>
          <th aria-label="Actions"></th>
        </tr>
      </thead>
      <tbody>
        {#each filteredCustomers as customer (customer.id)}
          <tr>
            <td>
              <strong>{customer.email}</strong>
              {#if customer.name}<div class="muted" style="font-size: 0.85rem;">{customer.name}</div>{/if}
            </td>
            <td>{formatDate(customer.createdAt)}</td>
            <td class="num">{formatMoney(customer.totalSpentCents)}</td>
            <td class="num">{customer.purchaseCount}</td>
            <td>{formatDate(customer.lastPurchaseAt)}</td>
            <td><a class="link" href={`/admin/customers/${customer.id}`}>View</a></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</main>
