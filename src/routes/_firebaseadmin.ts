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

const createToken = async (address: string, claims?: any) => {
	try {
		return await authClient.createCustomToken(address, claims);
	} catch (error) {
		console.log(error);
	}
};

const createUser = async (address: string, claims?: any) => {
	// creates user
	let uid = '';
	try {
		return await authClient
			.createUser({
				email: `${address}@metamask.io`
			})
			.then(async (e) => {
				const setClaim = {
					metamask_user: true,
					metamask_paid: await validKey(address)
				};
				uid = e.uid;
				let token = await createToken(uid, setClaim);

				return token;
			});
	} catch (error) {
		// if user already exists, return create token
		return await createToken(address, claims);
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
