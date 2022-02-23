<script lang="ts">
	export let subscriptionType: string = 'ether'; // Stripe payments if user logs in with a email account
	export let account: string = '';
	export let uid: string = '';
	export let clientSecret;
	import { contract } from '$lib/contants';

	import { getPrice, purchase } from '$lib/unlock/utils';
	import { CONTRACT, ethereum, provider, signer } from '$lib/web3';
	import ABI from '$lib/contract.abi.json';
	import { loginWithGoogle, logOut, metamaskSignIn } from '$lib/client/firebase';
	import { signature } from '$lib/stores';
	import { handleSignMessage } from '$lib/web3/helpers';
	import Stripe from '$lib/vendor/Stripe.svelte';
	import { base } from '$app/paths';

	const CONTRACT_ADDRESS = contract;

	let lock: any, subscriptionPriceEth: any;
	let transactionHash: string;
	let debugMessage = '';
	async function buyUnlock() {
		lock = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
		subscriptionPriceEth = await getPrice(lock);
		let { tx } = await purchase(lock, signer, account);

		transactionHash = tx.hash;
		if (transactionHash) {
			let receipt = await provider.waitForTransaction(transactionHash, 1);
			console.log(receipt);
			debugMessage = `The unlock requires a signature to regenrate key.`;
			if (receipt) {
				await setClaims(
					{
						metamask_paid: true
					},
					false,
					'metamask'
				);
			}

			// logout and regenrate token || add claim to user
		}
	}

	async function setClaims(claims: object, reload: boolean, provider: string) {
		await fetch(`${base}/api/addclaim`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				uid,
				claims
			})
		})
			.then((e) => e.json())
			.then((e) => {
				console.log(e);
				logOut({ reload }).then(() => {
					if (provider === 'metamask') {
						signWithMessage();
					} else {
						loginWithGoogle();
					}
				});
			});
	}
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

	// Stripe stuff

	export let id = '';
	export let status = '';
	async function buyStripe() {
		console.log('Stripe payment');
		await setClaims(
			{
				stripe_paid: true
			},
			false,
			'stripe'
		);
	}
	$: console.log({ id, status });
	$: if (status === 'succeeded') {
		buyStripe();
	}
</script>

{#if subscriptionType == 'ether' && ethereum}
	<button on:click={buyUnlock}> Purchase with ETH </button>
	<p>{debugMessage}</p>
{:else}
	<Stripe {clientSecret} {account} bind:id bind:status>
		<!-- <button on:click={buyStripe}> Purchase with Stripe </button> -->
	</Stripe>
{/if}
