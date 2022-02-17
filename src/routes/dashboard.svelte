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
	import Purchase from '$lib/common/Purchase.svelte';
	export let user: any;

	$: subscriptionType = user ? (user.claims.metamask_user ? 'ether' : 'stripe') : null; // <- this is the subscription mode to buy with

	$: hasUserPaid = user ? user.claims.metamask_paid || user.claims.stripe_paid : null;

	$: account = user ? (user.claims.metamask_user ? user.address : user.email) : null;

	$: console.log(subscriptionType, hasUserPaid);
</script>

<p>You need the membership to unlock this content.</p>

{#if hasUserPaid}
	<p>Success!</p>
{:else}
	<Purchase {subscriptionType} {account} />
{/if}
