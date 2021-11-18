import { validKey } from '../_ethersAdapter';
import { addClaim } from '../_firebaseadmin';

export async function post({ body }) {
	const address = body.address;
	let valid = await validKey(address);
	if (valid) {
		await addClaim(address, {
			metamask_user: true,
			metamask_paid: valid
		});
	}
	return {
		body: { upgraded: valid }
	};
}
