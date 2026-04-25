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

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Account security</p>
    <h1>Active sessions</h1>
    <p class="lede">Review where your account is signed in and revoke access you no longer recognize.</p>
  </header>

  {#if form?.error}
    <p class="error-text" aria-live="polite">{form.error}</p>
  {/if}
  {#if form?.success}
    <p class="success-text" aria-live="polite">{form.success}</p>
  {/if}

  <section class="sessions">
    {#if data.sessions.length === 0}
      <article class="surface empty">
        <h2>No active sessions</h2>
        <p class="muted">Sign in again to create a new session.</p>
      </article>
    {:else}
      {#each data.sessions as session (session.id)}
        {@const isCurrent = session.id === data.currentSessionId}
        <article class="surface session" class:is-current={isCurrent}>
          <div class="session-body">
            <header class="session-head">
              <h2>{isCurrent ? 'Current session' : 'Signed-in session'}</h2>
              {#if isCurrent}
                <span class="badge badge-success">This device</span>
              {/if}
            </header>
            <p class="ua muted">{session.userAgent ?? 'Unknown browser'}</p>
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
          <form method="POST" action="?/revokeSession" class="session-action">
            <input type="hidden" name="sessionId" value={session.id} />
            {#if isCurrent}
              <button class="btn btn-danger" type="submit">Sign out this device</button>
            {:else}
              <button class="btn btn-ghost" type="submit">Revoke</button>
            {/if}
          </form>
        </article>
      {/each}
    {/if}
  </section>
</main>

<style>
  .sessions {
    display: grid;
    gap: 1rem;
  }

  .session {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1.5rem;
    align-items: start;
  }

  .session-body {
    display: grid;
    gap: 0.75rem;
    min-width: 0;
  }

  .session-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .session-head h2 {
    margin: 0;
    font-size: 1.05rem;
  }

  .ua {
    margin: 0;
    font-size: 0.85rem;
    overflow-wrap: anywhere;
  }

  dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
    gap: 0.75rem;
    margin: 0;
  }

  dt {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  dd {
    margin: 0;
    color: var(--color-text-primary);
    overflow-wrap: anywhere;
  }

  .session-action {
    align-self: center;
  }

  .empty h2 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 44rem) {
    .session {
      grid-template-columns: 1fr;
    }
    .session-action {
      justify-self: stretch;
    }
    .session-action .btn {
      width: 100%;
    }
  }
</style>
