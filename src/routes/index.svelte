<script lang="ts">
	import { loginWithGoogle, logOut, readDoc, metamaskSignIn } from '$lib/firebase';
	import { currentUser, isLoggingIn } from '$lib/stores';

	import { CONTRACT, ethereum, provider, signer } from '$lib/web3';
	import { onMount } from 'svelte';
	import ABI from '$lib/contract.abi.json';
	import { contract } from '$lib/contants';
	import { getPrice, handleSignMessage, purchase } from '$lib/unlock/utils';
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
				logOut();
				account = accounts[0];
			});
			ethereum.on('chainChanged', function () {
				window.location.reload();
			});
		} else {
			console.log('No ethereum?');
		}
	}
	async function connect() {
		try {
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});
			account = accounts[0];
		} catch (e) {
			console.log(e.message);
			error = e.message;
		}
	}
	async function init() {
		connect();

		lock = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
		subscriptionPriceEth = await getPrice(lock);

		if (!account && ethereum.selectedAddress) {
			provider.getSigner();
			account = ethereum.selectedAddress;
		}
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
			// logOut();
			// metamaskSignIn();
			// regenerate token with claim.
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
		console.log(await handleSignMessage(signer, data.address, data.nonce));
		
	}
	// $: console.log('currentUser=>', $currentUser);
</script>

<h4>Only works with Rinkeby</h4>
<!-- You can login with google, but you cannot have the claims added (yet) paywall with stripe/rapyd -->
<button on:click={loginWithGoogle}> Google </button>
<button on:click={signWithMessage}> signWithMessage </button>

{#if ethereum}
	{#if !$currentUser.loggedIn && account}
		<button on:click={metamaskSignIn}> Login Metamask </button>
	{/if}
	{#if $currentUser.uid}
		<button on:click={logOut}> Logout </button>
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
			<button on:click={makePurchase}>
				Purchase for {subscriptionPriceEth ? subscriptionPriceEth : 'loading price'} ETH
			</button>
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
	<pre>{logs ?JSON.stringify(logs, null, 4) :''}</pre>
</code>
<code>
	<pre>{error ?JSON.stringify(error, null, 4) :''}</pre>
</code>
