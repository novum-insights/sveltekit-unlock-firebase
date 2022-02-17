<script lang="ts">
	export let subscriptionType: string = 'ether'; // Stripe payments if user logs in with a email account
	export let account: string = '';
	export let uid: string = '';
	import { contract } from '$lib/contants';

	import { getPrice, purchase } from '$lib/unlock/utils';
	import { CONTRACT, ethereum, provider, signer } from '$lib/web3';
	import ABI from '$lib/contract.abi.json';
	import { base } from '$app/paths';
	import { logOut, metamaskSignIn } from '$lib/client/firebase';

	const CONTRACT_ADDRESS = contract;

	let lock: any, subscriptionPriceEth: any;
	let transactionHash: string;

	async function buyUnlock() {
		lock = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
		subscriptionPriceEth = await getPrice(lock);
		let { tx } = await purchase(lock, signer, account);

		transactionHash = tx.hash;
		if (transactionHash) {
			let receipt = await provider.waitForTransaction(transactionHash, 1);
			console.log(receipt);
			if (receipt) {
				await setClaims(
					{
						metamask_paid: true
					},
					false
				);
			}

			// logout and regenrate token || add claim to user
		}
	}
	async function buyStripe() {
		console.log('Stripe payment');
		await setClaims(
			{
				stripe_paid: true
			},
			false
		);
	}

	async function setClaims(claims, reload) {
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
				logOut({ reload }).then(() => metamaskSignIn());
			});
	}
</script>

{#if subscriptionType == 'ether' && ethereum}
	<button on:click={buyUnlock}> Purchase with ETH </button>
{:else}
	<button on:click={buyStripe}> Purchase with Stripe </button>
{/if}
