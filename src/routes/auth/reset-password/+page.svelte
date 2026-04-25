<script lang="ts">
  import { authClient } from '$lib/auth/client';

  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let message = $state('');
  let loading = $state(false);

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    loading = true;
    error = '';
    message = '';

    if (password !== confirmPassword) {
      error = 'Passwords do not match.';
      loading = false;
      return;
    }

    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      error = 'Reset token is missing.';
      loading = false;
      return;
    }

    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (result.error) {
      error = result.error.message ?? 'Something went wrong. Please try again.';
      loading = false;
      return;
    }

    message = 'Password updated. You can sign in now.';
    loading = false;
  }
</script>

<svelte:head>
  <title>Set new password - The Trading Store</title>
</svelte:head>

<main class="auth-page">
  <form class="auth-card" onsubmit={submit}>
    <p class="eyebrow">The Trading Store</p>
    <h1>Set a new password</h1>

    <label>
      New password
      <input bind:value={password} minlength="12" required type="password" />
    </label>

    <label>
      Confirm password
      <input bind:value={confirmPassword} minlength="12" required type="password" />
    </label>

    {#if error}
      <p class="error" aria-live="polite">{error}</p>
    {/if}

    {#if message}
      <p class="message" aria-live="polite">{message}</p>
    {/if}

    <button disabled={loading} type="submit">
      {loading ? 'Updating password...' : 'Update password'}
    </button>
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

