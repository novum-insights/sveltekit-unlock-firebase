<script>
	import { authChanged } from '$lib/firebase';
	import { firebaseEnv } from '$lib/stores';

	import { onMount } from 'svelte';

	onMount(() => {
		if ($firebaseEnv.firebaseControlled) authChanged();
	});

</script>

<svelte:head>
	<title>Sveltekit Unlock Protocol + Firebase Auth with Metamask Demo</title>
</svelte:head>

<slot />
