<svelte:head>
  <title>The Trading Store</title>
  <meta
    name="description"
    content="A premium digital storefront for serious trading education."
  />
</svelte:head>

<main class="shell">
  <section class="hero" aria-labelledby="page-title">
    <p class="eyebrow">The Trading Store</p>
    <h1 id="page-title">Master the markets. Trade with conviction.</h1>
    <p class="lede">
      A focused digital bookstore for premium trading material. Two books, real prices,
      secure checkout, and private library access after purchase.
    </p>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    min-block-size: 100vh;
    color: oklch(93% 0.012 255);
    background: oklch(13% 0.025 260);
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .shell {
    display: grid;
    min-block-size: 100vh;
    place-items: center;
    padding: clamp(2rem, 6vw, 6rem);
  }

  .hero {
    inline-size: min(100%, 68rem);
  }

  .eyebrow {
    margin: 0 0 1rem;
    color: oklch(70% 0.018 255);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0;
  }

  h1 {
    max-inline-size: 13ch;
    margin: 0;
    font-size: clamp(3rem, 2.2rem + 3vw, 5.5rem);
    line-height: 0.95;
    letter-spacing: 0;
  }

  .lede {
    max-inline-size: 42rem;
    margin: 1.5rem 0 0;
    color: oklch(70% 0.018 255);
    font-size: clamp(1.125rem, 1.06rem + 0.26vw, 1.25rem);
    line-height: 1.6;
  }
</style>

