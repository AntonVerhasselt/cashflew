<script>
  import Nav from '$components/Nav.svelte';
  import '../app.css';
  import { page } from '$app/stores';
</script>

{#if $page.url.pathname !== '/login'}
  <div class="flex min-h-screen">
    <Nav />
    <main class="flex-grow p-6 ml-48 max-w-[calc(100vw-12rem)]">
      <slot />
    </main>
  </div>
{:else}
  <slot />
{/if}
