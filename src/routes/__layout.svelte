<script>
	import { authChanged } from '$lib/firebase';

	import { onMount } from 'svelte';

	onMount(() => authChanged());
</script>

<svelte:head>
	<title>Sveltekit Unlock Protocol + Firebase Auth with Metamask Demo</title>
</svelte:head>

<slot />
