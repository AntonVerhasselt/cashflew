<script lang="ts">
	function handleLogin() {
		const exactAuthUrl = 'https://start.exactonline.be/api/oauth2/auth' +
			'?client_id=6735a7a2-af5a-420d-bed3-4eb7e64cab8e' +
			'&redirect_uri=https://cashflew.loca.lt/auth/callback' +
			'&response_type=code' +
			'&force_login=0';

		try {
			console.log('Redirecting to:', exactAuthUrl);
			window.location.href = exactAuthUrl;
		} catch (error) {
			console.error('Error during login redirect:', error);
			alert('An error occurred during login. Please try again.');
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="bg-white p-8 rounded-lg shadow-md">
		<h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
		<button
			on:click={handleLogin}
			class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
		>
			Login with Exact
		</button>
	</div>
</div>
