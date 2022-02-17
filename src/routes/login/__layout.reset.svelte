<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	import { authChanged } from '$lib/client/firebase';
	import { currentUser } from '$lib/stores';

	import { onMount } from 'svelte';
	onMount(async () => {
		authChanged();
	});
	$: {
		if (!$currentUser.uid) {
			if (browser) goto('/login');
		} else {
			if (browser) goto('/');
		}
	}
</script>

<slot />
