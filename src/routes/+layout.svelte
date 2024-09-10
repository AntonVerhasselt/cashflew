<script lang="ts">
  import Nav from '$components/Nav.svelte';
  import '../app.css';
  import { onMount } from 'svelte';
  import { getAuthToken, getUserInfo, refreshToken, removeAuthToken } from '$lib/exactAuth';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  let user = null;
  let isLoading = true;

  onMount(async () => {
    const tokenData = getAuthToken();
    if (tokenData) {
      if (Date.now() >= tokenData.expires_at - 30000) { // Refresh if less than 30 seconds left
        try {
          await refreshToken(tokenData.refresh_token);
        } catch (error) {
          console.error('Error refreshing token:', error);
          removeAuthToken();
          goto('/login');
        }
      }
    } else {
      goto('/login');
    }
  });

  onMount(async () => {
    if (browser) {
      const tokenData = getAuthToken();
      if (tokenData) {
        try {
          const accessToken = typeof tokenData === 'string' ? tokenData : tokenData.access_token;
          user = await getUserInfo(accessToken);
        } catch (error) {
          console.error('Error fetching user info:', error);
          // If there's an error, clear the token and redirect to login
          removeAuthToken();
          goto('/login');
        }
      }
      isLoading = false;
      if (!user) {
        goto('/login');
      }
    }
  });
</script>

{#if isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <p>Loading...</p>
  </div>
{:else if user}
  <div class="flex min-h-screen">
    <Nav {user} />
    <main class="flex-grow p-6 ml-48 max-w-[calc(100vw-12rem)]">
      <slot />
    </main>
  </div>
{:else}
  <slot />
{/if}
