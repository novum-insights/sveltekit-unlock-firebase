<script lang="ts">
	import { loginWithGoogle, logOut, readDoc, metamaskSignIn } from '$lib/firebase';
	import { currentUser, isLoggingIn, signature } from '$lib/stores';

	import { CONTRACT, ethereum, provider, signer } from '$lib/web3';
	import { onMount } from 'svelte';
	import ABI from '$lib/contract.abi.json';
	import { contract } from '$lib/contants';
	import { getPrice, handleSignMessage, purchase } from '$lib/unlock/utils';
	import { connect, requestNetwork } from '$lib/web3/helpers';
	const CONTRACT_ADDRESS = contract;

	let lock: any, subscriptionPriceEth: any;

	let error = '';
	let account = '';
	let logs = '';
	let transactionHash = '';
	let data: any = '';

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
		lock = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
		subscriptionPriceEth = await getPrice(lock);
		if (account) {
			$currentUser.address = account;
		} else {
			console.log('Need metamask');
		}
	}
	onMount(() => {
		// console.log('on mount');
		if (ethereum) init();
	});
	async function getData() {
		account ? (data = await readDoc('user_data/user_collection')) : '';
	}
	async function makePurchase() {
		let { tx, e } = await purchase(lock, signer, account);
		logs = tx;
		error = e;
		transactionHash = tx.hash;
		if (transactionHash) {
			let receipt = await provider.waitForTransaction(transactionHash, 5);
			// logout and regenrate token
			if (receipt) {
				logOut({ reload: false }).then(() => metamaskSignIn());
			}
		}
	}

	async function signWithMessage() {
		let data = await fetch('/api/nonce', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				address: account
			})
		}).then((e) => e.json());

		// console.log(await handleSignMessage(signer, data.address, data.nonce));
		$signature = await handleSignMessage(signer, data.address, data.nonce);
		metamaskSignIn();
	}
	// $: console.log('currentUser=>', $currentUser);
</script>

<h4>Only works with Rinkeby</h4>
<!-- You can login with google, but you cannot have the claims added (yet) paywall with stripe/rapyd -->
{#if !$currentUser.uid && !$currentUser.loggedIn}
	<button on:click={loginWithGoogle}>
		<img src="https://img.icons8.com/color/32/000000/google-logo.png" alt="" /></button
	>
{/if}

{#if ethereum}
	{#if !$currentUser.loggedIn && account}
		<button on:click={signWithMessage}>
			<img
				src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
				alt=""
			/></button
		>
		<!-- <button on:click={metamaskSignIn}> </button> -->
	{/if}
	{#if $currentUser.uid}
		<button on:click={() => logOut({ reload: true })}> Logout </button>
		<p>
			logged in as {$currentUser.uid}
			{$currentUser.user.email}
		</p>

		<h1>
			{data ? JSON.stringify(data) : ''}
		</h1>
	{/if}

	{#if $currentUser.uid && $currentUser.upgraded}
		<button on:click={getData}> Fetch Data</button>
	{:else if $currentUser.loggedIn && !$currentUser.upgraded}
		<div>
			<p>You need the membership to unlock this content.</p>
			<button on:click={makePurchase}>
				Purchase for {subscriptionPriceEth ? subscriptionPriceEth : 'loading price'} ETH
			</button>
			{#if transactionHash}
				<p>
					Transaction hash:
					<a href="https://rinkeby.etherscan.io/tx/{transactionHash}">{transactionHash}</a> waiting for
					5 confirmations, you may log out and log back in to access the content.
				</p>
			{/if}
		</div>
	{/if}
	{#if !account}
		<p>{error}</p>

		<button on:click={connect}>Connect metamask</button>
	{/if}
{:else}
	<p>To login with web3 please install metamask</p>
{/if}

{#if $isLoggingIn}
	<p>Logging in...</p>
{/if}
<code>
	<pre>{logs ?JSON.stringify(logs, null, 2) :''}</pre>
</code>
<code>
	<pre>{error ?JSON.stringify(error, null, 2) :''}</pre>
</code>
