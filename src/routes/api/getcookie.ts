import { sessionCookie } from '$lib/server/_firebaseadmin';

export async function post({ request }) {
	const { token } = await request.json();
	const cookie = await sessionCookie(token);
	return {
		headers: {
			'set-Cookie': `session=${cookie}; HttpOnly; Path=/; Secure`
		},
		body: {
			success: true
		}
	};
}
