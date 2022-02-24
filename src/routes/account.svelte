<script context="module">
	export async function load({ session, fetch }) {
		const { user: _user } = session;
		const user = await fetch(`/api/getuser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				uid: _user.uid
			})
		}).then((e) => e.json());
		return {
			props: user
		};
	}
</script>

<script lang="ts">
	import { linkProviders } from '$lib/client/firebase';

	export let user;

	// check if providerId has google in providerData
	$: isGoogle = user.providerData.find((provider) => provider.providerId.includes('google.com'));

	let showDebug = false;
</script>

{#if !isGoogle}
	<p>Link your web3 with google login.</p>
	<button on:click={linkProviders}> Link google </button>
{:else}
	<p>You have linked your web3 account with google.</p>
{/if}

<button on:click={() => (showDebug = !showDebug)}>
	{showDebug ? 'Hide' : 'Show'} debug data
</button>

{#if showDebug}
	<code>
		<pre>{JSON.stringify(user, null, 2)}</pre>
	</code>
{/if}
