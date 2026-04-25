<svelte:head>
  <title>Terms of service - The Trading Store</title>
</svelte:head>

<main class="legal">
  <p class="eyebrow">Legal</p>
  <h1>Terms of service</h1>
  <section>
    <h2>Use of the store</h2>
    <p>
      The Trading Store sells downloadable educational books for individual use. You are
      responsible for keeping your account credentials secure and for using the materials in a
      lawful way.
    </p>
  </section>
  <section>
    <h2>Digital access</h2>
    <p>
      Purchases grant access to the book listed at checkout. Access can be limited or revoked for
      refunded, disputed, fraudulent, or abusive activity.
    </p>
  </section>
  <section>
    <h2>No financial advice</h2>
    <p>
      Materials are educational only. They do not guarantee trading outcomes, investment returns,
      or suitability for any specific financial situation.
    </p>
  </section>
  <section>
    <h2>Support</h2>
    <p>
      For account, download, or refund help, contact support@thetrading.store from the email on
      your account.
    </p>
  </section>
</main>

<style>
  .legal {
    display: grid;
    gap: 1rem;
    max-inline-size: 54rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  section {
    display: grid;
    gap: 0.5rem;
    padding-block: 1rem;
    border-block-start: 1px solid oklch(28% 0.028 260);
  }

  p {
    color: oklch(70% 0.018 255);
    line-height: 1.65;
  }

  .eyebrow {
    color: oklch(68% 0.14 150);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
  }
</style>
