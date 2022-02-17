import { listAllUsers } from '$lib/server/_firebaseadmin';

export async function post(req) {
	let users = await listAllUsers();
	return {
		body: { users }
	};
}
