import { getClaimsbyUid } from '$lib/server/_firebaseadmin';

export async function post({ body }) {
	const uid = body.uid;

	return {
		body: await getClaimsbyUid(uid)
	};
}
