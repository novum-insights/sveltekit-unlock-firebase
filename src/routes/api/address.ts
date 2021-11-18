import { validKey } from '../_ethersAdapter';
import { createUser, getUidbyEmail } from '../_firebaseadmin';

export async function post({ body }) {
	const address = body.address;
	let token = await createUser(address);
	let uid = await getUidbyEmail(address);

	return {
		body: { token, uid, upgraded: await validKey(address) }
	};
}
