<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { sessionStore, clearSession } from '$lib/auth/sessionStore';

	interface Session {
		isAuthenticated: boolean;
		accessToken: string | null;
		refreshToken: string | null;
		userInfo: { [key: string]: any } | null;
	}

	let showMenu = false;
	let menuContainer: HTMLElement;
	let session: Session;
	let userInfo: {
		FullName: string;
		PictureUrl: string;
		Email: string;
	} | null = null;

	sessionStore.subscribe(value => {
		session = value;
		if (session.userInfo && session.userInfo.d && session.userInfo.d.results && session.userInfo.d.results[0]) {
			userInfo = {
				FullName: session.userInfo.d.results[0].FullName,
				PictureUrl: session.userInfo.d.results[0].PictureUrl,
				Email: session.userInfo.d.results[0].Email
			};
		} else {
			userInfo = null;
		}
	});

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuContainer && !menuContainer.contains(event.target as Node)) {
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

	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		showMenu = !showMenu;
	}

	async function handleLogout() {
		clearSession();
		closeMenu();
	}
</script>

{#if session.isAuthenticated}
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
				<li class="mb-3">
					<a href="/invoices" class="flex items-center text-gray-700 hover:text-gray-900">
						<span class="mr-2">📄</span>
						<span>Invoices</span>
					</a>
				</li>
			</ul>

			<div class="mt-auto relative" bind:this={menuContainer}>
				{#if showMenu}
					<div
						transition:fade={{ duration: 100 }}
						class="absolute bottom-full left-0 w-full bg-white shadow-md rounded-lg overflow-hidden mb-2"
					>
						<a
							href="/settings"
							on:click={closeMenu}
							class="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs">Settings</a
						>
						<button
							on:click={handleLogout}
							class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-xs"
							>Log out</button
						>
					</div>
				{/if}
				<button
					class="flex items-center justify-between rounded-lg cursor-pointer w-full text-left"
					on:click={toggleMenu}
				>
					<div class="flex items-center overflow-hidden mr-1">
						{#if userInfo}
							<img
								src={userInfo.PictureUrl}
								alt={userInfo.FullName}
								class="w-6 h-6 rounded-full flex-shrink-0 mr-2"
							/>
							<span class="text-xs font-medium truncate">
								{userInfo?.FullName ?? 'Unknown User'}
							</span>
						{:else}
							<img
								src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
								alt="User"
								class="w-6 h-6 rounded-full flex-shrink-0 mr-2"
							/>
							<span class="text-xs font-medium truncate">
								Unknown Username
							</span>
						{/if}
					</div>
					<span class="text-gray-500 ml-1">⋮</span>
				</button>
			</div>
		</div>
	</nav>
{/if}
