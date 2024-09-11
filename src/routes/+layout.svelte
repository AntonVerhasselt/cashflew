<script lang="ts">
  import Nav from '$components/Nav.svelte';
  import '../app.css';
  import { sessionStore } from '$lib/auth/sessionStore'; // Import the session

  interface Session {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    userInfo: { [key: string]: any } | null;
  }

  let session: Session;
  sessionStore.subscribe(value => {
    session = value;
  });
</script>

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