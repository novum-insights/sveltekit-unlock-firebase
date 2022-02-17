import { validKey } from '$lib/server/_ethersAdapter';
import { parse } from 'cookie';
import { decodeToken, verifyCookie } from './lib/server/_firebaseadmin';

export async function handle({ event, resolve }) {
	const cookies = parse(event.request.headers.get('cookie') || '');
	const token = cookies.session;
	const user = await verifyCookie(token);

	const userData = user && {
		uid: user.uid,
		email: user.email.includes('@metamask.io') ? null : user.email,
		address: user.email.includes('@metamask.io') ? user.email.split('@metamask.io')[0] : null,
		claims: {
			metamask_paid: user.email.includes('@metamask.io')
				? await validKey(user.email.split('@metamask.io')[0])
				: false,
			metamask_user: user.email.includes('@metamask.io') ? true : false,
			stripe_paid: user.stripe_paid
		}
	};
	
	event.locals = {
		user: token ? userData : null
	};
	const response = await resolve(event, {
		ssr: false
	});
	return response;
}

export function getSession({ locals }) {
	return {
		user: locals.user && {
			...locals.user
		}
	};
}
