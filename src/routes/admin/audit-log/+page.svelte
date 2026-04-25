<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const formatDate = (value: Date | string): string =>
    new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  const stringify = (metadata: Record<string, unknown> | null): string =>
    metadata ? JSON.stringify(metadata) : '';
</script>

<svelte:head>
  <title>Audit log - The Trading Store</title>
</svelte:head>

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Admin</p>
    <h1>Audit log</h1>
    <p class="lede">Trace account, entitlement, purchase, and product operations.</p>
  </header>

  <form class="filter-bar" method="GET">
    <div class="form-group">
      <span class="form-label">Search</span>
      <input name="q" placeholder="Action or actor email" value={data.filters.query} />
    </div>
    <div class="form-group">
      <span class="form-label">Resource</span>
      <select name="resourceType">
        <option value="">All resources</option>
        {#each data.resourceTypes as resourceType (resourceType)}
          <option value={resourceType} selected={data.filters.resourceType === resourceType}>
            {resourceType}
          </option>
        {/each}
      </select>
    </div>
    <div class="actions">
      <button class="btn btn-primary" type="submit">Apply</button>
      <a class="btn btn-ghost" href="/admin/audit-log">Reset</a>
    </div>
  </form>

  <section class="events" aria-label="Audit events">
    {#if data.events.length === 0}
      <article class="surface empty">
        <h2>No events found</h2>
        <p class="muted">Try a broader search.</p>
      </article>
    {:else}
      {#each data.events as event (event.id)}
        <article class="surface event">
          <header class="event-head">
            <h2>{event.action}</h2>
            <p class="muted event-meta">
              {formatDate(event.createdAt)}
              {#if event.actorEmail}· {event.actorEmail}{/if}
              {#if event.ipAddress}· {event.ipAddress}{/if}
            </p>
          </header>
          <dl>
            <div>
              <dt>Resource</dt>
              <dd>{event.resourceType ?? 'none'}</dd>
            </div>
            <div>
              <dt>Resource ID</dt>
              <dd>{event.resourceId ?? 'none'}</dd>
            </div>
            {#if event.metadata}
              <div>
                <dt>Metadata</dt>
                <dd><code>{stringify(event.metadata)}</code></dd>
              </div>
            {/if}
          </dl>
        </article>
      {/each}
    {/if}
  </section>
</main>

<style>
  .events {
    display: grid;
    gap: 1rem;
  }

  .empty h2 {
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
  }

  .event {
    display: grid;
    gap: 1rem;
  }

  .event-head h2 {
    font-size: 1.05rem;
    margin: 0 0 0.25rem;
  }

  .event-meta {
    margin: 0;
    font-size: 0.85rem;
  }

  dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
    gap: 0.85rem;
    margin: 0;
  }

  dt {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--color-text-muted);
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  dd {
    margin: 0;
    color: var(--color-text-primary);
    overflow-wrap: anywhere;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.85em;
    color: var(--color-text-secondary);
  }
</style>
