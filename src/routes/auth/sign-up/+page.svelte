<script lang="ts">
  import { authClient } from '$lib/auth/client';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let loading = $state(false);

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    loading = true;
    error = '';

    if (password !== confirmPassword) {
      error = 'Passwords do not match.';
      loading = false;
      return;
    }

    const product = new URLSearchParams(window.location.search).get('product');
    const callbackURL = product ? `/books/${product}` : '/library';
    const result = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL,
    });

    if (result.error) {
      error = result.error.message ?? 'Something went wrong. Please try again.';
      loading = false;
      return;
    }

    window.location.href = callbackURL;
  }
</script>

<svelte:head>
  <title>Sign up - The Trading Store</title>
</svelte:head>

<main class="auth-page">
  <form class="auth-card" onsubmit={submit}>
    <p class="eyebrow">The Trading Store</p>
    <h1>Create your account</h1>

    <label>
      Name
      <input bind:value={name} autocomplete="name" name="name" required />
    </label>

    <label>
      Email
      <input bind:value={email} autocomplete="email" name="email" required type="email" />
    </label>

    <label>
      Password
      <input
        bind:value={password}
        autocomplete="new-password"
        minlength="12"
        name="password"
        required
        type="password"
      />
    </label>

    <label>
      Confirm password
      <input
        bind:value={confirmPassword}
        autocomplete="new-password"
        minlength="12"
        name="confirm-password"
        required
        type="password"
      />
    </label>

    {#if error}
      <p class="error" aria-live="polite">{error}</p>
    {/if}

    <button disabled={loading} type="submit">
      {loading ? 'Creating account...' : 'Create account'}
    </button>

    <p class="helper">Already have an account? <a href="/auth/sign-in">Sign in</a></p>
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

