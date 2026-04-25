<svelte:head>
  <title>Purchase complete - The Trading Store</title>
</svelte:head>

<main class="state">
  <p class="mark">✓</p>
  <h1>Welcome to your library.</h1>
  <p>Your purchase is being finalized. If it is not visible yet, refresh in a few seconds.</p>
  <a href="/library">Go to library -></a>
</main>

<style>
  .state {
    display: grid;
    min-block-size: 70vh;
    place-items: center;
    align-content: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .mark {
    color: oklch(68% 0.14 150);
    font-size: 3rem;
  }

  p {
    margin: 0;
    color: oklch(70% 0.018 255);
  }

  a {
    color: oklch(70% 0.18 255);
  }
</style>

