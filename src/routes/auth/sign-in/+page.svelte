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

<main class="auth-page-layout">
  <form class="auth-card-layout" onsubmit={submit}>
    <div>
      <p class="eyebrow">The Trading Store</p>
      <h1 class="auth-title">Welcome back</h1>
    </div>

    <label class="form-group">
      <span class="form-label">Email</span>
      <input class="form-input" bind:value={email} autocomplete="email" name="email" required type="email" placeholder="you@example.com" />
    </label>

    <label class="form-group">
      <span class="form-label">Password</span>
      <input
        class="form-input"
        bind:value={password}
        autocomplete="current-password"
        minlength="12"
        name="password"
        required
        type="password"
        placeholder="••••••••••••"
      />
    </label>

    <div style="text-align: right;">
      <a class="auth-link" href="/auth/forgot-password" style="font-size: 0.875rem;">Forgot password?</a>
    </div>

    {#if error}
      <p class="error" aria-live="polite" style="color: var(--color-danger); font-size: 0.875rem;">{error}</p>
    {/if}

    <button class="btn btn-primary" disabled={loading} type="submit" style="width: 100%;">{loading ? 'Signing in...' : 'Sign in'}</button>

    <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
      <p class="auth-helper"><a class="auth-link" href="/auth/magic-link">Sign in with magic link instead</a></p>
      <p class="auth-helper">Don't have an account? <a class="auth-link" href="/auth/sign-up">Sign up</a></p>
    </div>
  </form>
</main>
