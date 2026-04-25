<script lang="ts">
  import { authClient } from '$lib/auth/client';

  let email = $state('');
  let message = $state('');
  let error = $state('');
  let loading = $state(false);

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    loading = true;
    error = '';
    message = '';

    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: '/auth/reset-password',
    });

    if (result.error) {
      error = result.error.message ?? 'Something went wrong. Please try again.';
      loading = false;
      return;
    }

    message = 'Check your email - a reset link is on the way.';
    loading = false;
  }
</script>

<svelte:head>
  <title>Reset password - The Trading Store</title>
</svelte:head>

<main class="auth-page">
  <form class="auth-card" onsubmit={submit}>
    <p class="eyebrow">The Trading Store</p>
    <h1>Reset your password</h1>
    <p class="copy">Enter your email and we'll send a reset link.</p>

    <label>
      Email
      <input bind:value={email} autocomplete="email" name="email" required type="email" />
    </label>

    {#if error}
      <p class="error" aria-live="polite">{error}</p>
    {/if}

    {#if message}
      <p class="message" aria-live="polite">{message}</p>
    {/if}

    <button disabled={loading} type="submit">{loading ? 'Sending link...' : 'Send link'}</button>
    <p class="helper"><a href="/auth/sign-in">Return to sign in</a></p>
  </form>
</main>

<style>
  .auth-page {
    display: grid;
    min-block-size: 100vh;
    place-items: center;
    padding: 2rem;
  }

  .auth-card {
    display: grid;
    inline-size: min(100%, 26rem);
    gap: 1rem;
    padding: 2rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 8px;
    background: oklch(17% 0.026 260);
  }

  .eyebrow,
  .copy,
  .helper {
    color: oklch(70% 0.018 255);
    font-size: 0.875rem;
  }

  h1,
  p {
    margin: 0;
  }

  label {
    display: grid;
    gap: 0.5rem;
    color: oklch(70% 0.018 255);
    font-size: 0.875rem;
  }

  input {
    min-block-size: 2.75rem;
    border: 1px solid oklch(28% 0.028 260);
    border-radius: 6px;
    padding: 0 0.875rem;
    color: oklch(93% 0.012 255);
    background: oklch(13% 0.025 260);
    font: inherit;
  }

  input:focus-visible,
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid oklch(72% 0.18 255);
    outline-offset: 2px;
  }

  button {
    min-block-size: 2.75rem;
    border: 0;
    border-radius: 6px;
    color: oklch(13% 0.025 260);
    background: oklch(64% 0.18 255);
    font: inherit;
    font-weight: 700;
  }

  a {
    color: oklch(70% 0.18 255);
  }

  .error {
    color: oklch(64% 0.18 25);
    font-size: 0.875rem;
  }

  .message {
    color: oklch(68% 0.14 150);
    font-size: 0.875rem;
  }
</style>

