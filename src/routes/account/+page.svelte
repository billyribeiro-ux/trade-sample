<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const formatDate = (value: Date | string | null): string => {
    if (!value) {
      return 'None yet';
    }

    return new Date(value).toLocaleDateString();
  };
</script>

<svelte:head>
  <title>Account - The Trading Store</title>
</svelte:head>

<main class="page">
  <header>
    <p class="eyebrow">Member dashboard</p>
    <h1>Account</h1>
    <p>Manage your profile, password, receipts, downloads, and active sessions.</p>
  </header>

  <section class="summary" aria-label="Account summary">
    <article>
      <span>{data.summary.activeEntitlements}</span>
      <p>Active books</p>
    </article>
    <article>
      <span>{data.summary.totalPurchases}</span>
      <p>Purchases</p>
    </article>
    <article>
      <span>{data.summary.activeSessions}</span>
      <p>Sessions</p>
    </article>
    <article>
      <span>{formatDate(data.summary.lastPurchaseAt)}</span>
      <p>Last purchase</p>
    </article>
  </section>

  <div class="grid">
    <section>
      <h2>Profile</h2>
      <p class="muted">{data.profile?.email}</p>
      <form method="POST" action="?/updateProfile">
        <label>
          Display name
          <input name="name" autocomplete="name" required maxlength="120" value={data.profile?.name ?? ''} />
        </label>

        {#if form?.action === 'updateProfile' && form.error}
          <p class="error" aria-live="polite">{form.error}</p>
        {/if}
        {#if form?.action === 'updateProfile' && form.success}
          <p class="success" aria-live="polite">{form.success}</p>
        {/if}

        <button type="submit">Save profile</button>
      </form>
    </section>

    <section>
      <h2>Password</h2>
      <p class="muted">Use a unique password with at least 12 characters.</p>
      <form method="POST" action="?/changePassword">
        <label>
          Current password
          <input name="currentPassword" autocomplete="current-password" required minlength="12" type="password" />
        </label>
        <label>
          New password
          <input name="newPassword" autocomplete="new-password" required minlength="12" type="password" />
        </label>
        <label>
          Confirm new password
          <input name="confirmPassword" autocomplete="new-password" required minlength="12" type="password" />
        </label>

        {#if form?.action === 'changePassword' && form.error}
          <p class="error" aria-live="polite">{form.error}</p>
        {/if}
        {#if form?.action === 'changePassword' && form.success}
          <p class="success" aria-live="polite">{form.success}</p>
        {/if}

        <button type="submit">Change password</button>
      </form>
    </section>
  </div>

  <nav class="links" aria-label="Account sections">
    <a href="/library">Library</a>
    <a href="/account/purchases">Purchases</a>
    <a href="/account/security">Security</a>
  </nav>
</main>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  header {
    display: grid;
    gap: 0.5rem;
    max-inline-size: 52rem;
  }

  header p,
  .muted,
  label,
  .links {
    color: oklch(70% 0.018 255);
  }

  .eyebrow {
    color: oklch(68% 0.14 150);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .summary,
  .grid {
    display: grid;
    gap: 1rem;
  }

  .summary {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  }

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr));
  }

  section,
  .summary article {
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  .summary article {
    display: grid;
    gap: 0.25rem;
  }

  .summary span {
    font-size: clamp(1.2rem, 2vw, 1.8rem);
    font-weight: 800;
  }

  section,
  form {
    display: grid;
    gap: 1rem;
  }

  label {
    display: grid;
    gap: 0.45rem;
    font-size: 0.9rem;
  }

  input {
    min-block-size: 2.75rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 6px;
    padding-inline: 0.875rem;
    color: oklch(93% 0.012 255);
    background: oklch(13% 0.025 260);
    font: inherit;
  }

  button {
    min-block-size: 2.75rem;
    border: 0;
    border-radius: 6px;
    padding-inline: 1rem;
    color: oklch(13% 0.025 260);
    background: oklch(64% 0.18 255);
    font: inherit;
    font-weight: 700;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  a,
  .success {
    color: oklch(70% 0.18 255);
  }

  .error {
    color: oklch(64% 0.18 25);
  }
</style>
