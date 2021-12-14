import { connectedClients } from '../_firebaseadmin';

export async function get() {
	return {
		body: { connectedClients }
	};
}
