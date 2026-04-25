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
  {#if data.state === 'ready'}
    <p class="mark">✓</p>
    <h1>Welcome to your library.</h1>
    <p>{data.bookTitle} is ready to download.</p>
    {#if data.receiptUrl}
      <p><a href={data.receiptUrl}>View receipt</a></p>
    {/if}
    <a href="/library">Go to library -&gt;</a>
  {:else if data.state === 'processing'}
    <p class="mark">✓</p>
    <h1>Processing your purchase...</h1>
    <p>Stripe confirmed payment. We are waiting for the webhook to finish your library access.</p>
    <a href="/library">Check library -&gt;</a>
  {:else if data.state === 'unpaid'}
    <h1>Payment is not complete.</h1>
    <p>No library access has been granted for this checkout session.</p>
    <a href="/">Return to store -&gt;</a>
  {:else}
    <h1>Checkout session missing.</h1>
    <p>Return to the store or contact support if you were charged.</p>
    <a href="/">Return to store -&gt;</a>
  {/if}
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
