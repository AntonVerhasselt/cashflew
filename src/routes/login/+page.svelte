<script lang="ts">
import { getAuthorizationUrl } from '$lib/exactAuth';

function handleLogin() {
    window.location.href = getAuthorizationUrl();
}
</script>

<h1>Login</h1>
<button on:click={handleLogin}>Login with Exact</button>
