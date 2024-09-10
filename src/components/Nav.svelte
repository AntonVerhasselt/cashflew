<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let showMenu = false;
  let userImage = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  let menuContainer;
  let userName = 'Guest';

  onMount(() => {
    const handleClickOutside = (event) => {
      if (menuContainer && !menuContainer.contains(event.target)) {
        showMenu = false;
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function closeMenu() {
    showMenu = false;
  }

  function toggleMenu(event) {
    event.stopPropagation();
    showMenu = !showMenu;
  }

  function handleLogout() {
    closeMenu();
    // Implement proper logout logic here when you add authentication
  }
</script>

<nav>
  <div class="bg-gray-100 h-screen w-48 fixed left-0 top-0 p-4 flex flex-col text-sm">
    <ul class="flex-grow mt-6">
      <li class="mb-3">
        <a href="/" class="flex items-center text-gray-700 hover:text-gray-900">
          <span class="mr-2">📊</span>
          <span>Dashboard</span>
        </a>
      </li>
      <li class="mb-3">
        <a href="/emails" class="flex items-center text-gray-700 hover:text-gray-900">
          <span class="mr-2">📧</span>
          <span>Emails</span>
        </a>
      </li>
    </ul>
    
    <div class="mt-auto relative" bind:this={menuContainer}>
      {#if showMenu}
        <div transition:fade="{{ duration: 100 }}" class="absolute bottom-full left-0 w-full bg-white shadow-md rounded-lg overflow-hidden mb-2">
          <a href="/settings" on:click={closeMenu} class="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs">Settings</a>
          <button on:click={handleLogout} class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-xs">Log out</button>
        </div>
      {/if}
      <div class="flex items-center justify-between rounded-lg cursor-pointer" on:click={toggleMenu}>
        <div class="flex items-center overflow-hidden mr-1">
          <img src={userImage} alt="User" class="w-6 h-6 rounded-full flex-shrink-0 mr-2" />
          <span class="text-xs font-medium truncate">{userName}</span>
        </div>
        <span class="text-gray-500 ml-1">⋮</span>
      </div>
    </div>
  </div>
</nav>
