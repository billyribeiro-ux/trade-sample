<svelte:head>
  <title>Privacy policy - The Trading Store</title>
</svelte:head>

<main class="legal">
  <p class="eyebrow">Legal</p>
  <h1>Privacy policy</h1>
  <section>
    <h2>Data we collect</h2>
    <p>
      We collect the account email, display name, session metadata, purchase records, entitlement
      records, and operational audit events needed to run the storefront.
    </p>
  </section>
  <section>
    <h2>Payments</h2>
    <p>
      Stripe processes card details. The application stores Stripe identifiers, payment status, and
      receipt links, but it does not store raw card numbers.
    </p>
  </section>
  <section>
    <h2>Email</h2>
    <p>
      Transactional email is used for account access, purchase confirmations, grants, and refunds.
      Local development can log email links to the console when email credentials are absent.
    </p>
  </section>
  <section>
    <h2>Retention</h2>
    <p>
      Purchase, entitlement, and audit data is retained for support, compliance, abuse prevention,
      and operational troubleshooting.
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
