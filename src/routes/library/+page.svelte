<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let message = $state('');
  let error = $state('');
  let loadingSlug = $state<string | null>(null);

  async function download(slug: string): Promise<void> {
    loadingSlug = slug;
    error = '';
    message = '';
    const response = await fetch(`/api/books/${slug}/download`, { method: 'POST' });
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      error = result.error ?? 'Something went wrong. Please try again.';
      loadingSlug = null;
      return;
    }

    window.open(result.url, '_blank', 'noopener');
    message = 'Download started.';
    loadingSlug = null;
  }
</script>

<svelte:head>
  <title>Your library - The Trading Store</title>
</svelte:head>

<main class="library">
  <header>
    <h1>Your library</h1>
    <p>{data.books.length} books</p>
  </header>

  {#if message}
    <p class="message">{message}</p>
  {/if}
  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if data.books.length === 0}
    <section class="empty">
      <h2>Your library is empty.</h2>
      <p>Browse the store to get started.</p>
      <a href="/">Browse books -></a>
    </section>
  {:else}
    <section class="grid">
      {#each data.books as book}
        <article>
          <div class="cover">{book.name}</div>
          <div>
            <h2>{book.name}</h2>
            <p>{book.description}</p>
            {#if book.downloadPolicy === 'unlimited'}
              <span class="badge">Unlimited downloads</span>
            {:else}
              <span class="badge">{Math.max((book.downloadsAllowed ?? 0) - book.downloadsUsed, 0)} of {book.downloadsAllowed} downloads remaining</span>
            {/if}
            <button disabled={loadingSlug === book.slug} onclick={() => download(book.slug)}>
              {loadingSlug === book.slug ? 'Starting download...' : 'Download'}
            </button>
            {#if book.receiptUrl}
              <a href={book.receiptUrl} target="_blank" rel="noreferrer">View receipt</a>
            {/if}
          </div>
        </article>
      {/each}
    </section>
  {/if}
</main>

<style>
  .library {
    display: grid;
    gap: 2rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  header p,
  article p {
    color: oklch(70% 0.018 255);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr));
    gap: 1rem;
  }

  article {
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  .cover {
    display: grid;
    min-block-size: 11rem;
    place-items: center;
    border-radius: 6px;
    background: oklch(21% 0.028 260);
    color: oklch(70% 0.018 255);
    font-weight: 700;
  }

  .badge {
    display: inline-block;
    margin-block: 1rem;
    color: oklch(68% 0.14 150);
    font-size: 0.875rem;
  }

  button {
    display: block;
    min-block-size: 2.5rem;
    margin-block-end: 0.75rem;
    border: 0;
    border-radius: 6px;
    padding-inline: 1rem;
    color: oklch(13% 0.025 260);
    background: oklch(64% 0.18 255);
    font: inherit;
    font-weight: 700;
  }

  a {
    color: oklch(70% 0.18 255);
  }

  .empty {
    display: grid;
    gap: 0.75rem;
    place-items: center;
    min-block-size: 20rem;
    text-align: center;
  }

  .message {
    color: oklch(68% 0.14 150);
  }

  .error {
    color: oklch(64% 0.18 25);
  }
</style>

