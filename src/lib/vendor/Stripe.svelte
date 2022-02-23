<script lang="ts">
	import { onMount } from 'svelte';

	import { loadStripe } from '@stripe/stripe-js';
	import { Container, CardNumber, CardExpiry, CardCvc } from 'svelte-stripe-js';
	import { stripePubKey } from '$lib/contants';

	export let clientSecret;
	export let account;
	export let id;
	export let status;
	let error = '';
	let stripe = null;
	let cardElement;
	let processing = false;

	onMount(async () => {
		stripe = await loadStripe(stripePubKey);
	});

	async function submit() {
		// avoid processing duplicates
		if (processing) return;
		processing = true;
		// confirm payment with stripe
		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: cardElement,
				billing_details: {
					email: account
				}
			}
		});
		// log results, for debugging
		console.log({ result });
		id = result.paymentIntent.id;
		status = result.paymentIntent.status;
		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			// payment succeeded, redirect to "thank you" page
		}
	}

	const style = {
		base: {
			fontSize: '16px',
			color: '#424770',
			'::placeholder': {
				color: '#aab7c4'
			}
		},
		invalid: {
			color: '#9e2146'
		}
	};
</script>

{#if stripe}
	<div>
		<Container {stripe}>
			<form on:submit|preventDefault={submit}>
				<CardNumber bind:element={cardElement} {style} />
				<CardExpiry {style} />
				<CardCvc {style} />

				<button>Pay</button>
			</form>
		</Container>
	</div>
{/if}

<style>
	div{
		/* card */
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
		border-radius: 10px;
		background: #fafafa;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

	}
	button {
		width: 100%;
		background: #49b82e;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 15px;
		font-size: 1.2rem;
		cursor: pointer;
	}
</style>