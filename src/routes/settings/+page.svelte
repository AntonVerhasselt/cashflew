<script lang="ts">
  import { sessionStore } from '$lib/auth/sessionStore';

  interface ExtendedUserInfo {
    d?: { results: any[] };
  }

  let userInfo: any;
  sessionStore.subscribe(session => {
    userInfo = (session.userInfo as ExtendedUserInfo)?.d?.results[0] || null;
  });
</script>

<h1 class="text-2xl font-bold mb-4">Settings</h1>
<div class="bg-white shadow-md rounded-lg p-6 w-full">
  <h2 class="text-xl font-semibold mb-4">User Information</h2>
  {#if userInfo}
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="font-semibold">Full Name:</p>
        <p>{userInfo.FullName}</p>
      </div>
      <div>
        <p class="font-semibold">Email:</p>
        <p>{userInfo.Email}</p>
      </div>
      <div>
        <p class="font-semibold">Language:</p>
        <p>{userInfo.LanguageCode}</p>
      </div>
      <div>
        <p class="font-semibold">Phone:</p>
        <p>{userInfo.Phone || 'Not provided'}</p>
      </div>
    </div>
  {:else}
    <p>No user information available.</p>
  {/if}
</div>