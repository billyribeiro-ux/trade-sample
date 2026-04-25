<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { Snippet } from 'svelte';

  let { children, data }: { children: Snippet; data: { user: { email: string; name?: string | null } | null } } =
    $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<a class="skip" href="#content">Skip to content</a>
<header class="site-header glass">
  <a class="brand" href="/">The Trading Store</a>
  <nav aria-label="Primary">
    <a href="/library" class="nav-link">Library</a>
    {#if data.user}
      <a href="/account" class="nav-link">Account</a>
    {:else}
      <a href="/auth/sign-in" class="nav-link btn btn-primary">Sign in</a>
    {/if}
  </nav>
</header>

<div id="content">
  {@render children()}
</div>

<footer class="site-footer">
  <div>
    <strong>The Trading Store</strong>
    <p>support@thetrading.store</p>
  </div>
  <nav aria-label="Legal">
    <a href="/legal/terms">Terms</a>
    <a href="/legal/privacy">Privacy</a>
    <a href="/legal/refunds">Refunds</a>
  </nav>
</footer>

<style>
  .skip {
    position: absolute;
    inset-block-start: 1rem;
    inset-inline-start: 1rem;
    z-index: 100;
    transform: translateY(-200%);
    padding: 0.5rem 0.75rem;
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 500;
  }

  .skip:focus {
    transform: translateY(0);
  }

  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem clamp(1rem, 4vw, 4rem);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .site-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 2rem clamp(1rem, 4vw, 4rem);
    border-block-start: 1px solid var(--color-border);
    color: var(--color-text-muted);
    background: var(--color-bg-base);
  }

  .site-footer p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
  }

  .brand {
    font-family: var(--font-display);
    color: var(--color-text-primary);
    font-size: 1.25rem;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: -0.02em;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    color: var(--color-text-secondary);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .nav-link {
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .nav-link:hover {
    color: var(--color-text-primary);
  }

  nav a:not(.btn) {
    text-decoration: none;
  }

  @media (max-width: 40rem) {
    .site-header,
    .site-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 1.5rem;
    }
  }
</style>
