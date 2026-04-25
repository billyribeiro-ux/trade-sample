<svelte:head>
  <title>Refund policy - The Trading Store</title>
</svelte:head>

<main class="legal">
  <p class="eyebrow">Legal</p>
  <h1>Refund policy</h1>
  <section>
    <h2>14-day refund window</h2>
    <p>
      Purchases are eligible for a no-questions refund within 14 days. Contact support from the
      email on your account and include the book title or receipt link.
    </p>
  </section>
  <section>
    <h2>Access after refund</h2>
    <p>
      Refunded purchases revoke the related entitlement and remove future downloads for that book.
      If a refund webhook is replayed, the app keeps the operation idempotent.
    </p>
  </section>
  <section>
    <h2>Processing time</h2>
    <p>
      Refunds are issued through Stripe and typically appear on the original payment method within
      5-10 business days.
    </p>
  </section>
  <section>
    <h2>Disputes</h2>
    <p>
      Card disputes immediately mark the purchase as disputed and revoke access while the payment
      is reviewed.
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
