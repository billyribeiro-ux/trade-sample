<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import type { Snippet } from 'svelte';

  let { children, data }: { children: Snippet; data: { user: { email: string; name?: string | null } | null } } =
    $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<a class="skip" href="#content">Skip to content</a>
<header class="site-header">
  <a class="brand" href="/">The Trading Store</a>
  <nav aria-label="Primary">
    <a href="/library">Library</a>
    {#if data.user}
      <a href="/account">Account</a>
    {:else}
      <a href="/auth/sign-in">Sign in</a>
    {/if}
  </nav>
</header>

<div id="content">
  {@render children()}
</div>

<style>
  :global(body) {
    margin: 0;
    min-block-size: 100vh;
    color: oklch(93% 0.012 255);
    background: oklch(13% 0.025 260);
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  :global(a) {
    color: inherit;
  }

  :global(:focus-visible) {
    outline: 2px solid oklch(72% 0.18 255);
    outline-offset: 2px;
  }

  .skip {
    position: absolute;
    inset-block-start: 1rem;
    inset-inline-start: 1rem;
    z-index: 10;
    transform: translateY(-200%);
    padding: 0.5rem 0.75rem;
    background: oklch(64% 0.18 255);
    color: oklch(13% 0.025 260);
    border-radius: 6px;
  }

  .skip:focus {
    transform: translateY(0);
  }

  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem clamp(1rem, 4vw, 4rem);
    border-block-end: 1px solid oklch(28% 0.028 260);
  }

  .brand {
    color: oklch(93% 0.012 255);
    font-weight: 700;
    text-decoration: none;
  }

  nav {
    display: flex;
    gap: 1rem;
    color: oklch(70% 0.018 255);
    font-size: 0.9rem;
  }

  nav a {
    text-decoration: none;
  }
</style>
