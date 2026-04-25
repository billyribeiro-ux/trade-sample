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

<main class="library container">
  <header class="library-header">
    <h1 class="text-gradient">Your library</h1>
    <p>{data.books.length} books</p>
  </header>

  {#if message}
    <div class="alert alert-success" aria-live="polite">
      <p>{message}</p>
    </div>
  {/if}
  {#if error}
    <div class="alert alert-error" aria-live="polite">
      <p>{error}</p>
    </div>
  {/if}

  {#if data.books.length === 0}
    <section class="empty-state">
      <div class="empty-icon">📚</div>
      <h2>Your library is empty</h2>
      <p>Browse the store to get started.</p>
      <a href="/" class="btn btn-primary" style="margin-top: 1rem;">Browse books</a>
    </section>
  {:else}
    <section class="book-grid">
      {#each data.books as book}
        <article class="library-card">
          <div class="cover">
            <div class="cover-glow"></div>
            <span>{book.name}</span>
          </div>
          <div class="card-content">
            <div class="card-header">
              <h2>{book.name}</h2>
              <p>{book.description}</p>
            </div>
            
            <div class="card-footer">
              {#if book.downloadPolicy === 'unlimited'}
                <span class="badge badge-success">Unlimited downloads</span>
              {:else}
                <span class="badge badge-warning">{Math.max((book.downloadsAllowed ?? 0) - book.downloadsUsed, 0)} of {book.downloadsAllowed} remaining</span>
              {/if}
              
              <div class="actions">
                {#if book.receiptUrl}
                  <a href={book.receiptUrl} target="_blank" rel="noreferrer" class="receipt-link" title="View Receipt">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </a>
                {/if}
                <button class="btn btn-primary" disabled={loadingSlug === book.slug} onclick={() => download(book.slug)}>
                  {loadingSlug === book.slug ? 'Starting...' : 'Download'}
                </button>
              </div>
            </div>
          </div>
        </article>
      {/each}
    </section>
  {/if}
</main>

<style>
  .library {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding-block: clamp(3rem, 8vw, 6rem);
    animation: fade-in-up 0.6s var(--transition-bounce) forwards;
  }

  .library-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 1.5rem;
  }

  .library-header p {
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  h1, h2, p {
    margin: 0;
  }

  .alert {
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: 500;
  }

  .alert-success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-success);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .alert-error {
    background: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 32rem), 1fr));
    gap: 2rem;
  }

  .library-card {
    display: grid;
    grid-template-columns: 10rem 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    background: var(--color-bg-surface);
    transition: all var(--transition-normal);
  }

  .library-card:hover {
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-lg);
    background: var(--color-bg-elevated);
  }

  .cover {
    display: grid;
    min-block-size: 14rem;
    place-items: center;
    border-radius: var(--radius-md);
    background: var(--color-bg-base);
    color: var(--color-text-muted);
    font-weight: 700;
    font-family: var(--font-display);
    position: relative;
    overflow: hidden;
    border: 1px solid var(--color-border);
  }

  .cover-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent 0%, var(--color-primary-glow) 50%, transparent 100%);
    animation: rotate 10s linear infinite;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  .library-card:hover .cover-glow {
    opacity: 1;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .cover span {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 1rem;
    background: var(--color-bg-base);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-header h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .card-header p {
    color: var(--color-text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    width: fit-content;
  }

  .badge-success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-success);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .badge-warning {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .receipt-link {
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: var(--radius-md);
  }

  .receipt-link:hover {
    color: var(--color-primary);
    background: var(--color-bg-elevated);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-block-size: 20rem;
    text-align: center;
    background: var(--color-bg-surface);
    border: 1px dashed var(--color-border-hover);
    border-radius: var(--radius-xl);
    padding: 3rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .empty-state h2 {
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: var(--color-text-secondary);
  }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 48rem) {
    .library-card {
      grid-template-columns: 1fr;
    }
    .cover {
      min-block-size: 16rem;
    }
  }
</style>
