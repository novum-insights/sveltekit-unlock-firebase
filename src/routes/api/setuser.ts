export async function post({ request }) {
	const { token } = await request.json();

	return {
		headers: {
			'set-cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict`
		}
	};
}
