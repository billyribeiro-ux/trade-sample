<svelte:head>
  <title>Checkout canceled - The Trading Store</title>
</svelte:head>

<main class="state">
  <div class="card surface">
    <div class="icon" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    <h1>Checkout canceled</h1>
    <p class="muted">No charge was made. You can try again anytime.</p>
    <a class="btn btn-primary" href="/">Return to store →</a>
  </div>
</main>

<style>
  .state {
    display: grid;
    place-items: center;
    min-height: calc(100vh - 12rem);
    padding: clamp(2rem, 6vw, 4rem) 1rem;
    background:
      radial-gradient(36rem 26rem at 50% 0%, var(--color-primary-glow), transparent 70%);
  }

  .card {
    width: 100%;
    max-width: 28rem;
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
    background: var(--color-danger-glow);
    color: var(--color-danger);
    border: 1px solid var(--color-danger-border);
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
  }

  p {
    margin: 0;
  }
</style>
