import { stripeSecretKey } from '$lib/contants';
import Stripe from 'stripe';

// initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
	apiVersion: '2020-08-27'
});

// handle POST /create-payment-intent
export async function post({ request }) {
	// create the payment intent
	const { uid } = request.json();
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 30000,
		// note, for some EU-only payment methods it must be EUR
		currency: 'gbp',
		// specify what payment methods are allowed
		// can be card, sepa_debit, ideal, etc...
		payment_method_types: ['card'],
		metadata: {
			uid
		}
	});

	// return the clientSecret to the client
	return {
		body: {
			clientSecret: paymentIntent.client_secret
		}
	};
}
