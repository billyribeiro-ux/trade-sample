<script lang="ts">
  import { authClient } from '$lib/auth/client';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    loading = true;
    error = '';

    const redirectTo = new URLSearchParams(window.location.search).get('redirect') ?? '/library';
    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: redirectTo,
    });

    if (result.error) {
      error = result.error.message ?? 'Something went wrong. Please try again.';
      loading = false;
      return;
    }

    window.location.href = redirectTo;
  }
</script>

<svelte:head>
  <title>Sign in - The Trading Store</title>
</svelte:head>

<main class="auth-page">
  <form class="auth-card" onsubmit={submit}>
    <p class="eyebrow">The Trading Store</p>
    <h1>Welcome back</h1>

    <label>
      Email
      <input bind:value={email} autocomplete="email" name="email" required type="email" />
    </label>

    <label>
      Password
      <input
        bind:value={password}
        autocomplete="current-password"
        minlength="12"
        name="password"
        required
        type="password"
      />
    </label>

    <a class="quiet-link" href="/auth/forgot-password">Forgot password?</a>

    {#if error}
      <p class="error" aria-live="polite">{error}</p>
    {/if}

    <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Sign in'}</button>

    <p class="helper"><a href="/auth/magic-link">Sign in with magic link instead</a></p>
    <p class="helper">Don't have an account? <a href="/auth/sign-up">Sign up</a></p>
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
  .helper,
  .quiet-link {
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

  button:disabled {
    cursor: wait;
    opacity: 0.72;
  }

  a {
    color: oklch(70% 0.18 255);
  }

  .error {
    color: oklch(64% 0.18 25);
    font-size: 0.875rem;
  }
</style>

