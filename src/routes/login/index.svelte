<script lang="ts">
	import { base } from '$app/paths';

	import { loginWithGoogle, logOut, metamaskSignIn } from '$lib/client/firebase';

	import { signature } from '$lib/stores';
	import { ethereum, signer } from '$lib/web3';
	import { connect, handleSignMessage, requestNetwork } from '$lib/web3/helpers';
	import { onMount } from 'svelte';

	let account = '';
	$: {
		if (ethereum) {
			// console.log('$');
			ethereum.on('accountsChanged', function (accounts: Array<string>) {
				logOut({ reload: true });
			});
			ethereum.on('chainChanged', function () {
				window.location.reload();
			});
		} else {
			console.log('No ethereum?');
		}
	}

	async function init() {
		const accounts = await connect();
		account = accounts[0];
		requestNetwork({ chainId: '0x4' });

		if (!account) console.log('Need metamask');
	}
	onMount(() => {
		// console.log('on mount');
		if (ethereum) init();
	});

	async function signWithMessage() {
		let data = await fetch(`${base}/api/nonce`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				address: account
			})
		}).then((e) => e.json());
		$signature = await handleSignMessage(signer, data.address, data.nonce);
		await metamaskSignIn();
	}
</script>


<button on:click={loginWithGoogle}>
	<img src="https://img.icons8.com/color/32/000000/google-logo.png" alt="" />
</button>

{#if ethereum}
	<button on:click={signWithMessage}>
		<img
			src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
			alt=""
		/>
	</button>
{/if}
