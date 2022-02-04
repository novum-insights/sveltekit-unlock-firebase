import { parse } from 'cookie';
import { decodeToken } from './routes/_firebaseadmin';

export async function handle({ event, resolve }) {
	const cookies = parse(event.request.headers.get('cookie') || '');
	const token = cookies.token;
	const user = await decodeToken(token);
	event.locals.user = {
		data: token ? { ...user } : null
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
