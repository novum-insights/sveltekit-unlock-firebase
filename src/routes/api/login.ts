import { secureMessage } from '$lib/contants';
import { decodeAddress } from '$lib/server/_firebaseadmin';

export async function post({ request }) {
	const { message } = await request.json();
	const { token, uid, upgraded } = await decodeAddress(secureMessage, message);
	return {
		body: { token, uid, upgraded }
	};
}
