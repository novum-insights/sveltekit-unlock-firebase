import { connectedClients } from '$lib/server/_firebaseadmin';
export async function post({ request }) {
	const { address } = await request.json();
	const nonce = Math.floor(Math.random() * 100000);
	connectedClients[nonce] = address;
	let data = {
		address,
		nonce,
		connectedClients
	};
	return {
		body: data
	};
}
