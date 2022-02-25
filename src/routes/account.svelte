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
	import { linkProviders, linkWeb3Provider } from '$lib/client/firebase';
	import { ethereum } from '$lib/web3';

	export let user;

	// check if providerId has google in providerData
	$: isGoogle = user.providerData.find((provider) => provider.providerId.includes('google.com'));

	let showDebug = false;

    
</script>

{#if !isGoogle}
	<p>Link your web3 with google login.</p>
	<button on:click={linkProviders}> Link google </button>
{:else}
	<p>Link your web3 with google login.</p>
	{#if ethereum}
		<button on:click={linkWeb3Provider}> Link Web3 </button>
	{:else}
		<p>You need a web3 compatible browser or extension to use this feature.</p>
		<p>
			Consider installing MetaMask, download from <a href="https://metamask.io/">here</a>.
		</p>
	{/if}
{/if}

<div>
	<button on:click={() => (showDebug = !showDebug)}>
		{showDebug ? 'Hide' : 'Show'} debug data
	</button>

	{#if showDebug}
		<code>
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</code>
	{/if}
</div>

<style>
	div {
		margin-top: 2em;
	}
</style>
