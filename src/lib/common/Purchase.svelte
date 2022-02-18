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
	import { signature } from '$lib/stores';
	import { handleSignMessage } from '$lib/web3/helpers';

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

	async function setClaims(claims: object, reload: boolean) {
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
				logOut({ reload }).then(() => signWithMessage());
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
</script>

{#if subscriptionType == 'ether' && ethereum}
	<button on:click={buyUnlock}> Purchase with ETH </button>
	<p>{debugMessage}</p>
{:else}
	<button on:click={buyStripe}> Purchase with Stripe </button>
{/if}
