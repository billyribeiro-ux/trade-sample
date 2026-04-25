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

<main class="auth-page-layout">
  <form class="auth-card-layout" onsubmit={submit}>
    <div>
      <p class="eyebrow">The Trading Store</p>
      <h1 class="auth-title">Create your account</h1>
    </div>

    <label class="form-group">
      <span class="form-label">Name</span>
      <input class="form-input" bind:value={name} autocomplete="name" name="name" required placeholder="Jane Doe" />
    </label>

    <label class="form-group">
      <span class="form-label">Email</span>
      <input class="form-input" bind:value={email} autocomplete="email" name="email" required type="email" placeholder="you@example.com" />
    </label>

    <label class="form-group">
      <span class="form-label">Password</span>
      <input
        class="form-input"
        bind:value={password}
        autocomplete="new-password"
        minlength="12"
        name="password"
        required
        type="password"
        placeholder="••••••••••••"
      />
    </label>

    <label class="form-group">
      <span class="form-label">Confirm password</span>
      <input
        class="form-input"
        bind:value={confirmPassword}
        autocomplete="new-password"
        minlength="12"
        name="confirm-password"
        required
        type="password"
        placeholder="••••••••••••"
      />
    </label>

    {#if error}
      <p class="error" aria-live="polite" style="color: var(--color-danger); font-size: 0.875rem;">{error}</p>
    {/if}

    <button class="btn btn-primary" disabled={loading} type="submit" style="width: 100%;">
      {loading ? 'Creating account...' : 'Create account'}
    </button>

    <div style="margin-top: 1rem; text-align: center;">
      <p class="auth-helper">Already have an account? <a class="auth-link" href="/auth/sign-in">Sign in</a></p>
    </div>
  </form>
</main>
