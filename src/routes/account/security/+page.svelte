<svelte:head>
  <title>Security - The Trading Store</title>
</svelte:head>

<main class="page">
  <h1>Security</h1>
  <section>
    <h2>Active sessions</h2>
    <p>Your current session is active. Session management will expand as usage data grows.</p>
  </section>
</main>

<style>
  .page {
    display: grid;
    gap: 1rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  section {
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  p {
    color: oklch(70% 0.018 255);
  }
</style>

