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

<script lang="ts">
	import { readDoc } from '$lib/client/firebase';

	import Purchase from '$lib/common/Purchase.svelte';
	export let user: any;

	$: subscriptionType = user ? (user.claims.metamask_user ? 'ether' : 'stripe') : null; // <- this is the subscription mode to buy with

	$: hasUserPaid = user ? user.claims.metamask_paid || user.claims.stripe_paid : null;

	$: account = user ? (user.claims.metamask_user ? user.address : user.email) : null;
	$: uid = user ? user.uid : null;
	$: console.log(subscriptionType, hasUserPaid);
	let data: any = '';
	async function getData() {
		account ? (data = await readDoc('user_data/user_collection')) : '';
	}
</script>

{#if hasUserPaid}
	<p>Success!</p>
	<button on:click={getData}>Get data</button>

	{#if data}
		<h1>
			{data ? JSON.stringify(data) : ''}
		</h1>
	{/if}
{:else}
	<p>You need the membership to unlock this content.</p>
	<Purchase {subscriptionType} {account} {uid} />
{/if}
