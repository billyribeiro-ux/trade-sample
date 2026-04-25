<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Purchase complete - The Trading Store</title>
  {#if data.state === 'processing'}
    <meta http-equiv="refresh" content="2" />
  {/if}
</svelte:head>

<main class="state">
  <div class="card surface">
    {#if data.state === 'ready'}
      <div class="icon ok" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h1>Welcome to your library</h1>
      <p class="muted">{data.bookTitle} is ready to download.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/library">Go to library →</a>
        {#if data.receiptUrl}
          <a class="link" href={data.receiptUrl}>View receipt</a>
        {/if}
      </div>
    {:else if data.state === 'processing'}
      <div class="icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <h1>Processing your purchase…</h1>
      <p class="muted">Stripe confirmed payment. We're waiting for the webhook to finish your library access.</p>
      <a class="btn btn-primary" href="/library">Check library →</a>
    {:else if data.state === 'unpaid'}
      <div class="icon warn" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h1>Payment is not complete</h1>
      <p class="muted">No library access has been granted for this checkout session.</p>
      <a class="btn btn-primary" href="/">Return to store →</a>
    {:else}
      <h1>Checkout session missing</h1>
      <p class="muted">Return to the store or contact support if you were charged.</p>
      <a class="btn btn-primary" href="/">Return to store →</a>
    {/if}
  </div>
</main>

<style>
  .state {
    display: grid;
    place-items: center;
    min-height: calc(100vh - 12rem);
    padding: clamp(2rem, 6vw, 4rem) 1rem;
    background:
      radial-gradient(40rem 30rem at 30% 0%, var(--color-primary-glow), transparent 70%),
      radial-gradient(36rem 26rem at 90% 100%, rgba(196, 101, 74, 0.16), transparent 75%);
  }

  .card {
    width: 100%;
    max-width: 30rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
    padding: clamp(2rem, 4vw, 3rem);
  }

  .icon {
    width: 4rem;
    height: 4rem;
    display: grid;
    place-items: center;
    border-radius: var(--radius-full);
    background: var(--color-bg-elevated);
    color: var(--color-primary-hover);
    border: 1px solid var(--color-border);
  }

  .icon.ok {
    background: var(--color-success-glow);
    color: var(--color-success);
    border-color: var(--color-success-border);
  }

  .icon.warn {
    background: var(--color-warning-glow);
    color: var(--color-warning);
    border-color: var(--color-warning-border);
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
  }

  p {
    margin: 0;
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
</style>
