import { connectedClients } from '../_firebaseadmin';
export async function post({ body }) {
	const address = body.address;
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
