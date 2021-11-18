import { validKey } from '../_ethersAdapter';

export async function post({ body }) {
	const address = body.address;

	return {
		body: { upgraded: await validKey(address) }
	};
}
