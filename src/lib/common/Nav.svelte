<script lang="ts">
	import { page } from '$app/stores';
	import { logOut } from '$lib/client/firebase';

	const links = [
		['Home', ''],
		['Dashboard', 'dashboard'],
		['Account', 'account']
	];
</script>

<nav>
	<ul>
		{#each links as [name, url]}
			<li class:active={$page.url.pathname === '/' + url}>
				<a href={name === 'Home' ? '/' : url}>{name}</a>
			</li>
		{/each}
	</ul>
	<button on:click={() => logOut({ reload: true })}>Logout</button>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	ul {
		display: flex;
		gap: 2em;
		list-style: none;
		padding: 0;
	}
	a {
		color: #fff;
		text-decoration: none;
	}
	.active {
		text-decoration: underline;
	}
</style>
