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

  const selectedProduct = $derived(
    data.grantableProducts.find((product) => product.id === selectedProductId),
  );

  $effect(() => {
    if (!selectedProductId && data.grantableProducts[0]) {
      selectedProductId = data.grantableProducts[0].id;
    }
  });

  async function grantAccess() {
    if (!selectedProductId) {
      return;
    }

    isSubmitting = true;
    message = null;
    errorMessage = null;

    const response = await fetch(`/api/admin/customers/${data.customer.id}/grant-entitlement`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productId: selectedProductId,
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

<main class="page">
  <a class="back" href="/admin/customers">← Customers</a>

  <header>
    <div>
      <p>Customer</p>
      <h1>{data.customer.email}</h1>
      {#if data.customer.name}<span>{data.customer.name}</span>{/if}
    </div>
    <dl>
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

  <section class="panel" aria-labelledby="grant-title">
    <div>
      <h2 id="grant-title">Grant access</h2>
      <p>Manual grants create an entitlement without a purchase.</p>
    </div>

    <form
      class="grant"
      onsubmit={(event) => {
        event.preventDefault();
        void grantAccess();
      }}
    >
      <label>
        <span>Product</span>
        <select bind:value={selectedProductId}>
          {#each data.grantableProducts as product}
            <option value={product.id}>{product.name} · {formatMoney(product.amountCents)}</option>
          {/each}
        </select>
      </label>

      <label>
        <span>Downloads allowed</span>
        <input
          bind:value={downloadsAllowed}
          type="number"
          min="1"
          placeholder={selectedProduct?.downloadPolicy === 'capped'
            ? String(selectedProduct.downloadLimit ?? 3)
            : 'Unlimited'}
        />
      </label>

      <button disabled={isSubmitting || !selectedProductId}>Grant access</button>
    </form>

    {#if message}<p class="success" aria-live="polite">{message}</p>{/if}
    {#if errorMessage}<p class="error" aria-live="polite">{errorMessage}</p>{/if}
  </section>

  <section class="panel" aria-labelledby="entitlements-title">
    <h2 id="entitlements-title">Entitlements</h2>
    <div class="stack">
      {#each data.entitlements as entitlement}
        <article class:revoked={entitlement.revokedAt}>
          <div>
            <h3>{entitlement.productName}</h3>
            <p>
              Granted {formatDate(entitlement.grantedAt)}
              {#if entitlement.purchaseId}from purchase{:else}manually{/if}
            </p>
          </div>
          <span>
            {#if entitlement.downloadsAllowed === null}
              Unlimited downloads
            {:else}
              {Math.max(entitlement.downloadsAllowed - entitlement.downloadsUsed, 0)} of {entitlement.downloadsAllowed} remaining
            {/if}
          </span>
          {#if entitlement.revokedAt}
            <span>Revoked {formatDate(entitlement.revokedAt)}</span>
          {:else}
            <button class="danger" disabled={isSubmitting} onclick={() => revokeAccess(entitlement.id)}>
              Revoke
            </button>
          {/if}
        </article>
      {/each}
    </div>
  </section>

  <section class="panel" aria-labelledby="purchases-title">
    <h2 id="purchases-title">Purchases</h2>
    <div class="table">
      {#each data.purchases as purchase}
        <div class="row">
          <span>{formatDate(purchase.purchasedAt)}</span>
          <strong>{purchase.productName}</strong>
          <span>{formatMoney(purchase.amountPaidCents)}</span>
          <span>{purchase.status}</span>
          {#if purchase.stripeReceiptUrl}
            <a href={purchase.stripeReceiptUrl}>Receipt</a>
          {:else}
            <span>No receipt</span>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <section class="panel" aria-labelledby="audit-title">
    <h2 id="audit-title">Audit</h2>
    <div class="stack">
      {#each data.auditLog as event}
        <article>
          <div>
            <h3>{event.action}</h3>
            <p>{formatDate(event.createdAt)}</p>
          </div>
          <span>{event.resourceType ?? 'system'}</span>
        </article>
      {/each}
    </div>
  </section>
</main>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  .back,
  a {
    color: oklch(70% 0.18 255);
  }

  header,
  .panel,
  article,
  .row {
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  header {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 1fr);
    gap: 1rem;
    padding: 1.25rem;
  }

  h1,
  h2,
  h3,
  p,
  dl,
  dd {
    margin: 0;
  }

  h1 {
    overflow-wrap: anywhere;
    font-size: clamp(1.8rem, 1.5rem + 1.2vw, 3rem);
  }

  h2 {
    font-size: 1.25rem;
  }

  h3 {
    font-size: 1rem;
  }

  p,
  span,
  dt,
  dd {
    color: oklch(70% 0.018 255);
  }

  dl {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  dt {
    font-size: 0.8rem;
  }

  dd {
    margin-block-start: 0.25rem;
    color: oklch(92% 0.014 255);
    font-size: 1.15rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .panel {
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
  }

  .grant {
    display: grid;
    grid-template-columns: minmax(14rem, 1fr) minmax(10rem, 0.6fr) auto;
    gap: 0.75rem;
    align-items: end;
  }

  label {
    display: grid;
    gap: 0.4rem;
  }

  input,
  select {
    min-block-size: 2.75rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(13% 0.024 260);
    color: oklch(92% 0.014 255);
    padding-inline: 0.875rem;
  }

  button {
    min-block-size: 2.75rem;
    border: 0;
    border-radius: 8px;
    background: oklch(64% 0.18 255);
    color: oklch(12% 0.02 255);
    font-weight: 700;
    padding-inline: 1rem;
  }

  button:disabled {
    opacity: 0.5;
  }

  .danger {
    background: oklch(63% 0.2 25);
    color: oklch(98% 0.01 25);
  }

  .stack {
    display: grid;
    gap: 0.75rem;
  }

  article,
  .row {
    display: grid;
    grid-template-columns: minmax(12rem, 1fr) minmax(10rem, auto) minmax(7rem, auto);
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: oklch(13% 0.024 260);
  }

  article.revoked {
    opacity: 0.64;
  }

  .table {
    display: grid;
    gap: 0.75rem;
  }

  .row {
    grid-template-columns: minmax(11rem, 1fr) minmax(10rem, 1fr) 7rem 7rem 6rem;
  }

  .success {
    color: oklch(78% 0.16 150);
  }

  .error {
    color: oklch(76% 0.16 25);
  }

  @media (max-width: 760px) {
    header,
    .grant,
    article,
    .row {
      grid-template-columns: 1fr;
    }

    dl {
      grid-template-columns: 1fr;
    }
  }
</style>
