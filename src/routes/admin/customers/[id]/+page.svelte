<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let selectedProductId = $state('');
  let downloadsAllowed = $state('');
  let isSubmitting = $state(false);
  let message = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

  const formatDate = (date: Date | string | null) =>
    date
      ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date(date))
      : 'Never';

  const effectiveProductId = $derived(selectedProductId || data.grantableProducts[0]?.id || '');

  const selectedProduct = $derived(
    data.grantableProducts.find((product) => product.id === effectiveProductId),
  );

  async function grantAccess() {
    const productId = effectiveProductId;

    if (!productId) {
      return;
    }

    isSubmitting = true;
    message = null;
    errorMessage = null;

    const response = await fetch(`/api/admin/customers/${data.customer.id}/grant-entitlement`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productId,
        downloadsAllowed: downloadsAllowed ? Number(downloadsAllowed) : null,
      }),
    });

    isSubmitting = false;

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      errorMessage = body?.error ?? 'Something went wrong. Please try again.';
      return;
    }

    message = 'Access granted. The customer has been notified.';
    downloadsAllowed = '';
    await invalidateAll();
  }

  async function revokeAccess(entitlementId: string) {
    isSubmitting = true;
    message = null;
    errorMessage = null;

    const response = await fetch(`/api/admin/entitlements/${entitlementId}/revoke`, {
      method: 'POST',
    });

    isSubmitting = false;

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      errorMessage = body?.error ?? 'Something went wrong. Please try again.';
      return;
    }

    message = 'Access revoked.';
    await invalidateAll();
  }
</script>

<main class="page-shell">
  <a class="back link" href="/admin/customers">← Customers</a>

  <header class="customer-header surface">
    <div>
      <p class="eyebrow">Customer</p>
      <h1>{data.customer.email}</h1>
      {#if data.customer.name}<p class="muted">{data.customer.name}</p>{/if}
    </div>
    <dl class="meta">
      <div>
        <dt>Total spent</dt>
        <dd>{formatMoney(data.totalSpentCents)}</dd>
      </div>
      <div>
        <dt>Purchases</dt>
        <dd>{data.purchases.length}</dd>
      </div>
      <div>
        <dt>Joined</dt>
        <dd>{formatDate(data.customer.createdAt)}</dd>
      </div>
    </dl>
  </header>

  <section class="surface panel" aria-labelledby="grant-title">
    <div class="panel-head">
      <h2 id="grant-title">Grant access</h2>
      <p class="muted">Manual grants create an entitlement without a purchase.</p>
    </div>

    <form
      class="grant"
      onsubmit={(event) => {
        event.preventDefault();
        void grantAccess();
      }}
    >
      <div class="form-group">
        <span class="form-label">Product</span>
        <select bind:value={selectedProductId}>
          {#each data.grantableProducts as product (product.id)}
            <option value={product.id}>{product.name} · {formatMoney(product.amountCents)}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <span class="form-label">Downloads allowed</span>
        <input
          bind:value={downloadsAllowed}
          type="number"
          min="1"
          placeholder={selectedProduct?.downloadPolicy === 'capped'
            ? String(selectedProduct.downloadLimit ?? 3)
            : 'Unlimited'}
        />
      </div>

      <button class="btn btn-primary" disabled={isSubmitting || !effectiveProductId}>Grant access</button>
    </form>

    {#if message}<p class="success-text" aria-live="polite">{message}</p>{/if}
    {#if errorMessage}<p class="error-text" aria-live="polite">{errorMessage}</p>{/if}
  </section>

  <section class="surface panel" aria-labelledby="entitlements-title">
    <h2 id="entitlements-title">Entitlements</h2>
    <div class="stack">
      {#each data.entitlements as entitlement (entitlement.id)}
        <article class="entitlement" class:revoked={entitlement.revokedAt}>
          <div>
            <h3>{entitlement.productName}</h3>
            <p class="muted">
              Granted {formatDate(entitlement.grantedAt)}
              {#if entitlement.purchaseId}from purchase{:else}manually{/if}
            </p>
          </div>
          <span class="badge badge-neutral">
            {#if entitlement.downloadsAllowed === null}
              Unlimited downloads
            {:else}
              {Math.max(entitlement.downloadsAllowed - entitlement.downloadsUsed, 0)} of {entitlement.downloadsAllowed} remaining
            {/if}
          </span>
          {#if entitlement.revokedAt}
            <span class="badge badge-warning">Revoked {formatDate(entitlement.revokedAt)}</span>
          {:else}
            <button class="btn btn-danger" disabled={isSubmitting} onclick={() => revokeAccess(entitlement.id)}>
              Revoke
            </button>
          {/if}
        </article>
      {/each}
    </div>
  </section>

  <section class="surface panel" aria-labelledby="purchases-title">
    <h2 id="purchases-title">Purchases</h2>
    <div class="table-shell">
      <table class="data-table">
        <thead>
          <tr><th>Date</th><th>Book</th><th>Amount</th><th>Status</th><th>Receipt</th></tr>
        </thead>
        <tbody>
          {#each data.purchases as purchase (purchase.id)}
            <tr>
              <td>{formatDate(purchase.purchasedAt)}</td>
              <td><strong>{purchase.productName}</strong></td>
              <td class="num">{formatMoney(purchase.amountPaidCents)}</td>
              <td><span class="badge badge-neutral">{purchase.status}</span></td>
              <td>
                {#if purchase.stripeReceiptUrl}
                  <a class="link" href={purchase.stripeReceiptUrl}>Receipt</a>
                {:else}
                  <span class="muted">No receipt</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="surface panel" aria-labelledby="audit-title">
    <h2 id="audit-title">Audit</h2>
    <div class="stack">
      {#each data.auditLog as event (event.id)}
        <article class="audit-row">
          <div>
            <h3>{event.action}</h3>
            <p class="muted">{formatDate(event.createdAt)}</p>
          </div>
          <span class="badge badge-neutral">{event.resourceType ?? 'system'}</span>
        </article>
      {/each}
    </div>
  </section>
</main>

<style>
  .back {
    width: fit-content;
    font-size: 0.9rem;
  }

  .customer-header {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 1fr);
    gap: 1.5rem;
    align-items: center;
  }

  .customer-header h1 {
    margin: 0.25rem 0 0;
    font-size: clamp(1.6rem, 1.4rem + 1vw, 2.4rem);
    overflow-wrap: anywhere;
  }

  .meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin: 0;
  }

  dt {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
    font-weight: 600;
  }

  dd {
    margin: 0.25rem 0 0;
    color: var(--color-text-primary);
    font-size: 1.1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .panel {
    display: grid;
    gap: 1.25rem;
  }

  .panel h2 {
    font-size: 1.15rem;
    margin: 0;
  }

  .panel-head {
    display: grid;
    gap: 0.25rem;
  }

  .panel-head p {
    margin: 0;
  }

  .grant {
    display: grid;
    grid-template-columns: minmax(14rem, 1fr) minmax(10rem, 0.7fr) auto;
    gap: 1rem;
    align-items: end;
  }

  .stack {
    display: grid;
    gap: 0.75rem;
  }

  .entitlement,
  .audit-row {
    display: grid;
    grid-template-columns: minmax(12rem, 1fr) auto auto;
    gap: 1rem;
    align-items: center;
    padding: 0.85rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-base);
  }

  .audit-row {
    grid-template-columns: minmax(12rem, 1fr) auto;
  }

  .entitlement.revoked {
    opacity: 0.55;
  }

  .entitlement h3,
  .audit-row h3 {
    font-size: 0.95rem;
    margin: 0 0 0.15rem;
  }

  .entitlement p,
  .audit-row p {
    margin: 0;
    font-size: 0.85rem;
  }

  @media (max-width: 760px) {
    .customer-header,
    .meta,
    .grant,
    .entitlement,
    .audit-row {
      grid-template-columns: 1fr;
    }
  }
</style>
