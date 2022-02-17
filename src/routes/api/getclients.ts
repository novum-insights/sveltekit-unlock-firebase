import { connectedClients } from '$lib/server/_firebaseadmin';

export async function get() {
	return {
		body: { connectedClients }
	};
}
