import { secureMessage } from '$lib/contants';
import { verifyMessage } from '$lib/server/_ethersAdapter';
import { connectedClients } from '$lib/server/_firebaseadmin';

export async function post({ body }) {
	const signature = body.signature;
	const nonce = body.nonce;
	console.log({ nonce });
	let string = `${secureMessage}-${nonce}`;
	let _address = await verifyMessage(string, signature);
	
	console.log({ _address });
	//expected data = 0x6E8bDc2D0c92300Fe85EB033B450B557f2143B64
	return {
		body: { _address }
	};
}
