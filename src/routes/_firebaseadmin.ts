import admin from 'firebase-admin';
import serviceAccount from './serviceaccount.json';
import { validKey } from './_ethersAdapter';

const firebaseApp = admin.initializeApp(
	{
		//@ts-ignore
		credential: admin.credential.cert(serviceAccount),
		databaseURL: 'https://unlockprotocoldev.firebaseio.com'
	},
	'unlockprotocoldev'
);
const authClient = firebaseApp && firebaseApp.auth();
// const dbClient = firebaseApp && firebaseApp.firestore();

const createToken = async (uid: string, claims?: any) => {
	try {
		return await authClient.createCustomToken(uid, claims);
	} catch (error) {
		console.log(error);
	}
};

const createUser = async (address: string) => {
	// creates user
	let uid = '';
	const claims = {
		metamask_user: true,
		metamask_paid: await validKey(address)
	};
	let user: any = '';
	//check user
	try {
		user = await checkUser(await getUidbyEmail(address)).then((user) => (uid = user.uid));
		console.log('user exists');
		return await createToken(uid, claims);
	} catch (error) {
		console.log('creating user');
		return await authClient
			.createUser({
				email: `${address}@metamask.io`
			})
			.then(async (e) => {
				uid = e.uid;
				let token = await createToken(uid, claims);

				return token;
			});
	}
};

const checkUser = async (uid: string) => await authClient.getUser(uid).then((user) => user);

const addClaim = async (address: string, claims?: any) =>
	await authClient
		.setCustomUserClaims(await getUidbyEmail(address), claims)
		.then((e) => console.log(e));

const destroyToken = async (address: string) => await authClient.revokeRefreshTokens(address);

const getUidbyEmail = async (email: string) =>
	await authClient.getUserByEmail(`${email}@metamask.io`).then((user) => user.uid);

const getClaimsbyUid = async (uid: string) =>
	await authClient.getUser(uid).then((user) => {
		const claims = user.customClaims;
		if (claims) {
			return { claims };
		} else {
			return {};
		}
	});

const listAllUsers = async () => await authClient.listUsers(1).then((users) => users);
export {
	createUser,
	checkUser,
	addClaim,
	destroyToken,
	getUidbyEmail,
	getClaimsbyUid,
	listAllUsers
};
