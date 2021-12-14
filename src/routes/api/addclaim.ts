import { addClaims } from '../_firebaseadmin';

export async function post({ body }) {
	const uid = body.uid;
	const claims = body.claims;
	return {
		body: { upgraded: await addClaims(uid, claims) }
	};
}
