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

<main class="auth-page-layout">
  <form class="auth-card-layout" onsubmit={submit}>
    <div>
      <p class="eyebrow">The Trading Store</p>
      <h1 class="auth-title">Set a new password</h1>
    </div>

    <label class="form-group">
      <span class="form-label">New password</span>
      <input class="form-input" bind:value={password} minlength="12" required type="password" placeholder="••••••••••••" />
    </label>

    <label class="form-group">
      <span class="form-label">Confirm password</span>
      <input class="form-input" bind:value={confirmPassword} minlength="12" required type="password" placeholder="••••••••••••" />
    </label>

    {#if error}
      <p class="error" aria-live="polite" style="color: var(--color-danger); font-size: 0.875rem;">{error}</p>
    {/if}

    {#if message}
      <p class="message" aria-live="polite" style="color: var(--color-success); font-size: 0.875rem;">{message}</p>
    {/if}

    <button class="btn btn-primary" disabled={loading} type="submit" style="width: 100%;">
      {loading ? 'Updating password...' : 'Update password'}
    </button>
    <p class="auth-helper" style="margin-top: 1rem;"><a class="auth-link" href="/auth/sign-in">Return to sign in</a></p>
  </form>
</main>
