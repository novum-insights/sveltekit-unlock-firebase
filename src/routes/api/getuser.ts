import { checkUser } from "$lib/server/_firebaseadmin";

export async function post({request}) {
    const { uid } = await request.json();
    const user = await checkUser(uid);
    return {
        body: {
            user
        }
    }
}