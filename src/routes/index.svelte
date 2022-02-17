<script context="module" lang="ts">
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
	export let user;

	$: console.log(user); //<-- user object from hooks
</script>

{#if user}
	<p>uid: {user.uid}</p>
{:else}
	<p>Loading...</p>
{/if}
