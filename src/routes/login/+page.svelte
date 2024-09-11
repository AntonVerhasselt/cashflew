<script lang="ts">
  async function handleLogin() {
    // TODO: Implement login with Exact
    console.log('Login with Exact clicked');
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
