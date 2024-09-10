<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { exchangeCodeForToken, setAuthToken, getUserInfo } from '$lib/exactAuth';
	import { post } from '$lib/apiService';

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			console.log('Authorization code received:', code.substring(0, 10) + '...');
			try {
				const tokenResponse = await fetch('/api/auth/exchange-token', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ code })
				});
				const tokenData = await tokenResponse.json();
				console.log('Token data received in callback');
				setAuthToken(tokenData);

				console.log('Fetching user info...');
				const userInfoResponse = await fetch(`/api/auth/user-info?token=${tokenData.access_token}`);
				const userInfo = await userInfoResponse.json();
				console.log('User info received:', userInfo);

				// Rest of the code...
			} catch (error) {
				console.error('Authentication error:', error);
			}
		} else {
			console.error('No authorization code received');
		}
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<p>Authenticating...</p>
</div>
