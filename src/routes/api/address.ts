import { secureMessage } from '$lib/contants';
import { decodeAddress } from '../_firebaseadmin';

export async function post({ body }) {
	const message = body.message;
	const { token, uid, upgraded } = await decodeAddress(secureMessage, message);
	return {
		body: { token, uid, upgraded }
	};
}
