<script lang="ts">
  import { onMount } from 'svelte';
  import Nav from '$components/Nav.svelte';
  import '../app.css';
  import { sessionStore, getSession } from '$lib/auth/sessionStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  let session = getSession();
  let isLoading = true;
  let shouldShowContent = false;

  sessionStore.subscribe(value => {
    session = value;
  });

  function checkAuth() {
    if (browser && !session.isAuthenticated && !$page.url.pathname.startsWith('/auth')) {
      goto('/auth');
    } else {
      shouldShowContent = true;
    }
    isLoading = false;
  }

  onMount(() => {
    checkAuth();
  });

  $: if (browser && $page) {
    isLoading = true;
    shouldShowContent = false;
    checkAuth();
  }
</script>

{#if browser}
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  {:else if shouldShowContent}
    {#if session.isAuthenticated}
      <div class="flex min-h-screen">
        <Nav />
        <main class="flex-grow p-6 ml-48 max-w-[calc(100vw-12rem)]">
          <slot />
        </main>
      </div>
    {:else}
      <div class="flex min-h-screen">
        <main class="flex-grow w-full">
          <slot />
        </main>
      </div>
    {/if}
  {/if}
  {:else}
  <div class="flex items-center justify-center min-h-screen">
    <p>Loading...</p>
  </div>
{/if}