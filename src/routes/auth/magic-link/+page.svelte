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

    const result = await authClient.signIn.magicLink({
      email,
      callbackURL: '/library',
      errorCallbackURL: '/auth/magic-link',
    });

    if (result.error) {
      error = result.error.message ?? 'Something went wrong. Please try again.';
      loading = false;
      return;
    }

    message = 'Check your email - a link is on the way.';
    loading = false;
  }
</script>

<svelte:head>
  <title>Magic link - The Trading Store</title>
</svelte:head>

<main class="auth-page-layout">
  <form class="auth-card-layout" onsubmit={submit}>
    <div>
      <p class="eyebrow">The Trading Store</p>
      <h1 class="auth-title">Sign in with email</h1>
      <p class="auth-helper" style="text-align: left; margin-top: 0.5rem;">We'll email you a one-time link.</p>
    </div>

    <label class="form-group">
      <span class="form-label">Email</span>
      <input class="form-input" bind:value={email} autocomplete="email" name="email" required type="email" placeholder="you@example.com" />
    </label>

    {#if error}
      <p class="error" aria-live="polite" style="color: var(--color-danger); font-size: 0.875rem;">{error}</p>
    {/if}

    {#if message}
      <p class="message" aria-live="polite" style="color: var(--color-success); font-size: 0.875rem;">{message}</p>
    {/if}

    <button class="btn btn-primary" disabled={loading} type="submit" style="width: 100%;">
      {loading ? 'Sending link...' : 'Send link'}
    </button>
    <p class="auth-helper" style="margin-top: 1rem;"><a class="auth-link" href="/auth/sign-in">Use password instead</a></p>
  </form>
</main>
