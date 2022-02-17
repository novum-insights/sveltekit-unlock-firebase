<script context="module">
	export async function load({ session }) {
		const { user } = session;
		return {
			props: {
				user
			}
		};
	}
</script>

<script>
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	import { authChanged } from '$lib/client/firebase';
	import Nav from '$lib/common/Nav.svelte';
	import { currentUser } from '$lib/stores';

	import { onMount } from 'svelte';
	import '../app.css';

	onMount(async () => {
		authChanged();
	});
	export let user;
	$: {
		if (!user)
			if (!$currentUser.user) {
				if (browser) goto('/login');
			}
	}
</script>

<svelte:head>
	<title>Sveltekit Unlock Protocol + Firebase Auth with Metamask Demo</title>
</svelte:head>

<main>
	<Nav />
	<h4>Only works with Rinkeby</h4>

	<slot />
</main>

<style>
</style>
