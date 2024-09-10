<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { exchangeCodeForToken, setAuthToken, getUserInfo } from '$lib/exactAuth';
	import { post } from '$lib/apiService';

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			try {
				const tokenData = await exchangeCodeForToken(code);
				setAuthToken(tokenData.access_token);

				const userInfo = await getUserInfo(tokenData.access_token);

				// Check if user exists, if not create a new user
				const response = await post('/api/user', {
					sub: userInfo.id,
					email: userInfo.email,
					name: userInfo.name
				});

				if (response.success) {
					goto('/');
				} else {
					console.error('Failed to create/update user');
					goto('/login');
				}
			} catch (error) {
				console.error('Authentication error:', error);
			}
		}
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<p>Authenticating...</p>
</div>
