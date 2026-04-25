<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>
<main class="page">
  <h1>Audit log</h1>
  {#each data.events as event}
    <p>{new Date(event.createdAt).toLocaleString()} · {event.action}</p>
  {/each}
</main>
<style>.page { padding: clamp(2rem, 6vw, 6rem); }</style>

