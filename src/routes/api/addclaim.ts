import { addClaims } from '$lib/server/_firebaseadmin';

export async function post({ request }) {
	const { uid, claims } = await request.json();

	return {
		body: { upgraded: await addClaims(uid, claims) }
	};
}
