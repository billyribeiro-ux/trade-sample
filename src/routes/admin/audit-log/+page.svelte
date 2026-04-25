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

<main class="page">
  <header>
    <p class="eyebrow">Admin</p>
    <h1>Audit log</h1>
    <p>Trace account, entitlement, purchase, and product operations.</p>
  </header>

  <form class="filters" method="GET">
    <label>
      Search
      <input name="q" placeholder="Action or actor email" value={data.filters.query} />
    </label>
    <label>
      Resource
      <select name="resourceType">
        <option value="">All resources</option>
        {#each data.resourceTypes as resourceType}
          <option value={resourceType} selected={data.filters.resourceType === resourceType}>
            {resourceType}
          </option>
        {/each}
      </select>
    </label>
    <button type="submit">Apply</button>
    <a href="/admin/audit-log">Reset</a>
  </form>

  <section class="events" aria-label="Audit events">
    {#if data.events.length === 0}
      <article>
        <h2>No events found</h2>
        <p>Try a broader search.</p>
      </article>
    {:else}
      {#each data.events as event}
        <article>
          <div>
            <h2>{event.action}</h2>
            <p>
              {formatDate(event.createdAt)}
              {#if event.actorEmail}
                · {event.actorEmail}
              {/if}
              {#if event.ipAddress}
                · {event.ipAddress}
              {/if}
            </p>
          </div>
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
                <dd>{stringify(event.metadata)}</dd>
              </div>
            {/if}
          </dl>
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
  }

  header p,
  article p,
  label,
  dt {
    color: oklch(70% 0.018 255);
  }

  .eyebrow {
    color: oklch(68% 0.14 150);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  label {
    display: grid;
    gap: 0.4rem;
    min-inline-size: min(100%, 17rem);
    font-size: 0.9rem;
  }

  input,
  select {
    min-block-size: 2.5rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 6px;
    padding-inline: 0.75rem;
    color: oklch(93% 0.012 255);
    background: oklch(13% 0.025 260);
    font: inherit;
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

  .events {
    display: grid;
    gap: 1rem;
  }

  article {
    display: grid;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
    gap: 0.75rem;
  }

  dt {
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  dd {
    margin-block-start: 0.25rem;
    overflow-wrap: anywhere;
  }

  a {
    color: oklch(70% 0.18 255);
  }
</style>
