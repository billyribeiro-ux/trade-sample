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

<main class="page-shell">
  <header class="page-header">
    <p class="eyebrow">Member dashboard</p>
    <h1>Account</h1>
    <p class="lede">Manage your profile, password, receipts, downloads, and active sessions.</p>
  </header>

  <section class="stat-grid" aria-label="Account summary">
    <article class="stat-card">
      <span class="value">{data.summary.activeEntitlements}</span>
      <span class="label">Active books</span>
    </article>
    <article class="stat-card">
      <span class="value">{data.summary.totalPurchases}</span>
      <span class="label">Purchases</span>
    </article>
    <article class="stat-card">
      <span class="value">{data.summary.activeSessions}</span>
      <span class="label">Sessions</span>
    </article>
    <article class="stat-card">
      <span class="value">{formatDate(data.summary.lastPurchaseAt)}</span>
      <span class="label">Last purchase</span>
    </article>
  </section>

  <div class="grid">
    <section class="surface card">
      <header class="card-head">
        <h2>Profile</h2>
        <p class="muted">{data.profile?.email}</p>
      </header>
      <form method="POST" action="?/updateProfile" class="card-form">
        <div class="form-group">
          <span class="form-label">Display name</span>
          <input name="name" autocomplete="name" required maxlength="120" value={data.profile?.name ?? ''} />
        </div>

        {#if form?.action === 'updateProfile' && form.error}
          <p class="error-text" aria-live="polite">{form.error}</p>
        {/if}
        {#if form?.action === 'updateProfile' && form.success}
          <p class="success-text" aria-live="polite">{form.success}</p>
        {/if}

        <button class="btn btn-primary btn-block" type="submit">Save profile</button>
      </form>
    </section>

    <section class="surface card">
      <header class="card-head">
        <h2>Password</h2>
        <p class="muted">Use a unique password with at least 12 characters.</p>
      </header>
      <form method="POST" action="?/changePassword" class="card-form">
        <div class="form-group">
          <span class="form-label">Current password</span>
          <input name="currentPassword" autocomplete="current-password" required minlength="12" type="password" />
        </div>
        <div class="form-group">
          <span class="form-label">New password</span>
          <input name="newPassword" autocomplete="new-password" required minlength="12" type="password" />
        </div>
        <div class="form-group">
          <span class="form-label">Confirm new password</span>
          <input name="confirmPassword" autocomplete="new-password" required minlength="12" type="password" />
        </div>

        {#if form?.action === 'changePassword' && form.error}
          <p class="error-text" aria-live="polite">{form.error}</p>
        {/if}
        {#if form?.action === 'changePassword' && form.success}
          <p class="success-text" aria-live="polite">{form.success}</p>
        {/if}

        <button class="btn btn-primary btn-block" type="submit">Change password</button>
      </form>
    </section>
  </div>

  <nav class="quick-links" aria-label="Account sections">
    <a class="link" href="/library">Library →</a>
    <a class="link" href="/account/purchases">Purchases →</a>
    <a class="link" href="/account/security">Security →</a>
  </nav>
</main>

<style>
  .grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 26rem), 1fr));
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .card-head h2 {
    margin: 0 0 0.25rem;
    font-size: 1.2rem;
  }

  .card-head p {
    margin: 0;
    font-size: 0.9rem;
  }

  .card-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .quick-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }
</style>
