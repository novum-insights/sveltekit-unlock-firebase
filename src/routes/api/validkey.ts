import { validKey } from '../_ethersAdapter';

export async function post({ request }) {
	const { address } = await request.json();

	return {
		body: { upgraded: await validKey(address) }
	};
}
