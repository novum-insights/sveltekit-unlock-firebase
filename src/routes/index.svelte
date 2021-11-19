<script lang="ts">
	import { loginWithGoogle, logOut, readDoc, signIn } from '$lib/firebase';
	import { currentUser } from '$lib/stores';
	import { formatEther } from 'ethers/lib/utils';

	import { CONTRACT, ethereum, provider, signer } from '$lib/unlock';
	import { onMount } from 'svelte';
	import { BigNumber, ethers } from 'ethers';
	import ABI from '$lib/contract.abi.json';
	import { contract } from '$lib/contants';
	const CONTRACT_ADDRESS = contract;
	// perform metamask login and firebase login

	let lock: any, subscriptionPriceEth: any, contractWithSigner: any;

	let error = '';
	let account = '';
	async function loginWithMetamask() {
		if (account) {
			signIn();
		}
	}

	$: if (ethereum) {
		ethereum.on('accountsChanged', function (accounts) {
			logOut();
			account = accounts[0];
		});
		ethereum.on('chainChanged', function () {
			window.location.reload();
		});
	} else {
		console.log('No ethereum?');
	}
	async function init() {
		lock = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
		if (!account && ethereum.selectedAddress) {
			provider.getSigner();
			account = ethereum.selectedAddress;
		}
		if (account) {
			$currentUser.address = account;
			// checkSubscription();
		} else {
			console.log('Need metamask');
		}
	}
	onMount(() => {
		init();
		getPrice();
	});
	let data: any = '';
	async function getData() {
		account ? (data = await readDoc('user_data/user_collection')) : '';
	}

	async function getPrice() {
		subscriptionPriceEth = formatEther(BigNumber.from(await lock.keyPrice()));
	}
	async function purchase() {
		contractWithSigner = lock.connect(signer);

		try {
			await contractWithSigner.purchase(
				BigNumber.from(await lock.keyPrice()),
				account,
				ethers.constants.AddressZero,
				[],
				{
					value: BigNumber.from(await lock.keyPrice()),
					gasLimit: 250000
				}
			);
		} catch (e) {
			console.log(e);
			error = e.message;
		}
	}
	async function checkSubscription() {
		let upgraded = await lock.getHasValidKey(account);
		$currentUser.upgraded = upgraded;
		return upgraded;
	}
	async function addClaims() {
		return await fetch(`/api/addclaim`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				address: account
			})
		}).then((e) => e.json());
	}
	$: console.log('currentUser=>', $currentUser);
</script>

<!-- You can login with google, but you cannot have the claims added (yet) -->
<!-- <button on:click={loginWithGoogle}> Google </button> -->

{#if ethereum}
	{#if !$currentUser.loggedIn}
		<button on:click={loginWithMetamask}> Login Metamask </button>
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
		<p>
			<!-- this can be automated and add the claims after the transaction has succeeded -->
			I have made the transaction <button on:click={addClaims}>Add claim</button>
		</p>
	{:else if $currentUser.loggedIn && !$currentUser.upgraded}
		<div>
			<button on:click={purchase}>
				Purchase for {subscriptionPriceEth ? subscriptionPriceEth : 'loading price'} ETH
			</button>
		</div>
	{/if}
{:else}
	<p>Please install metamask</p>
{/if}
