<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Account - The Trading Store</title>
</svelte:head>

<main class="page">
  <h1>Account</h1>
  <section>
    <h2>Profile</h2>
    <p>Email</p>
    <strong>{data.user?.email}</strong>
  </section>
  <section>
    <h2>Password</h2>
    <a href="/auth/forgot-password">Reset password</a>
  </section>
  <section>
    <h2>Security</h2>
    <a href="/account/security">View sessions</a>
  </section>
</main>

<style>
  .page {
    display: grid;
    gap: 1rem;
    padding: clamp(2rem, 6vw, 6rem);
  }

  section {
    padding: 1rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  p {
    color: oklch(70% 0.018 255);
  }

  a {
    color: oklch(70% 0.18 255);
  }
</style>

