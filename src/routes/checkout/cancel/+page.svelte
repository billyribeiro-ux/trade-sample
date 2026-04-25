<svelte:head>
  <title>Checkout canceled - The Trading Store</title>
</svelte:head>

<main class="state">
  <h1>Checkout canceled.</h1>
  <p>No charge was made. You can try again anytime.</p>
  <a href="/">Return to store -></a>
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

  p {
    margin: 0;
    color: oklch(70% 0.018 255);
  }

  a {
    color: oklch(70% 0.18 255);
  }
</style>

