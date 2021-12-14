import { transaction } from '../_ethersAdapter';

export async function post({ body }) {
	const hash = body.hash;
	const { confirmations, status, to, from } = await transaction(hash);
	return {
		body: {
			confirmations,
			status,
			to,
			from
		}
	};
}
