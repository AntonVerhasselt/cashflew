<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { sessionStore, setTokens, setAuthenticated, setUserInfo } from '$lib/auth/sessionStore';

  interface PageData {
    accessToken?: string;
    refreshToken?: string;
    userInfo?: any; // Add this line
  }

  export let data: PageData;

  let message = 'Processing OAuth Callback...';

  onMount(() => {
    if (data.accessToken && data.refreshToken) {
      setTokens(data.accessToken, data.refreshToken);
      setAuthenticated(true);
      if (data.userInfo) {
        setUserInfo(data.userInfo); // Add this line
      }
      message = 'Authentication successful. Redirecting...';
      goto('/');
    } else {
      message = 'Authentication failed. Please try again.';
    }
  });
</script>

<h1>{message}</h1>
