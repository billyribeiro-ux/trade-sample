<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>
<main class="page">
  <h1>Customers</h1>
  {#each data.customers as customer}
    <p>{customer.email}</p>
  {/each}
</main>
<style>.page { padding: clamp(2rem, 6vw, 6rem); }</style>

