<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const formatDateTime = (value: Date | string): string =>
    new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
</script>

<svelte:head>
  <title>Security - The Trading Store</title>
</svelte:head>

<main class="page">
  <header>
    <p class="eyebrow">Account security</p>
    <h1>Active sessions</h1>
    <p>Review where your account is signed in and revoke access you no longer recognize.</p>
  </header>

  {#if form?.error}
    <p class="error" aria-live="polite">{form.error}</p>
  {/if}
  {#if form?.success}
    <p class="success" aria-live="polite">{form.success}</p>
  {/if}

  <section class="sessions">
    {#if data.sessions.length === 0}
      <article>
        <h2>No active sessions</h2>
        <p>Sign in again to create a new session.</p>
      </article>
    {:else}
      {#each data.sessions as session}
        <article>
          <div>
            <h2>
              {session.id === data.currentSessionId ? 'Current session' : 'Signed-in session'}
            </h2>
            <p>{session.userAgent ?? 'Unknown browser'}</p>
            <dl>
              <div>
                <dt>IP address</dt>
                <dd>{session.ipAddress ?? 'Unknown'}</dd>
              </div>
              <div>
                <dt>Last activity</dt>
                <dd>{formatDateTime(session.updatedAt)}</dd>
              </div>
              <div>
                <dt>Expires</dt>
                <dd>{formatDateTime(session.expiresAt)}</dd>
              </div>
            </dl>
          </div>
          <form method="POST" action="?/revokeSession">
            <input type="hidden" name="sessionId" value={session.id} />
            <button class:danger={session.id === data.currentSessionId} type="submit">
              {session.id === data.currentSessionId ? 'Sign out this device' : 'Revoke'}
            </button>
          </form>
        </article>
      {/each}
    {/if}
  </section>
</main>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  h1,
  h2,
  p,
  dl,
  dd {
    margin: 0;
  }

  header {
    display: grid;
    gap: 0.5rem;
    max-inline-size: 52rem;
  }

  header p,
  article p,
  dt {
    color: oklch(70% 0.018 255);
  }

  .eyebrow {
    color: oklch(68% 0.14 150);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .sessions {
    display: grid;
    gap: 1rem;
  }

  article {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
    gap: 0.75rem;
    margin-block-start: 1rem;
  }

  dt {
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  dd {
    margin-block-start: 0.25rem;
    overflow-wrap: anywhere;
  }

  button {
    min-block-size: 2.5rem;
    border: 0;
    border-radius: 6px;
    padding-inline: 1rem;
    color: oklch(13% 0.025 260);
    background: oklch(64% 0.18 255);
    font: inherit;
    font-weight: 700;
  }

  button.danger {
    background: oklch(64% 0.18 25);
  }

  .success {
    color: oklch(70% 0.18 255);
  }

  .error {
    color: oklch(64% 0.18 25);
  }

  @media (max-width: 44rem) {
    article {
      display: grid;
    }
  }
</style>
