import { firebaseAdmin } from '$lib/contants';
import admin from 'firebase-admin';
// import serviceAccount from './serviceaccount.json';
import { validKey, verifyMessage } from './_ethersAdapter';

export const connectedClients = {};

const validClaims = ['metamask_user', 'stripe_paid'];

const firebaseApp =
	!admin.apps.length &&
	admin.initializeApp({
		credential: admin.credential.cert(
			JSON.parse(Buffer.from(firebaseAdmin, 'base64').toString('ascii'))
		)
	});
const authClient = firebaseApp && firebaseApp.auth();
// const dbClient = firebaseApp && firebaseApp.firestore();

const createToken = async (uid: string, claims?: any) => {
	try {
		const token = await authClient.createCustomToken(uid, claims);
		return token;
	} catch (error) {
		console.log(error);
	}
};
const decodeAddress = async (message: string, signature: string) => {
	const address = await verifyMessage(message, signature);
	const token = await createUser(address);
	const uid = await getUidbyEmail(address);
	const upgraded = await validKey(address);
	// console.log({ token, uid, upgraded, address });
	return { token, uid, upgraded };
};
// specific to metamask
const createUser = async (address: string) => {
	// creates user
	let uid = '';
	const claims = {
		metamask_user: true,
		// metamask_paid: await validKey(address)
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

const addClaims = async (uid: string, claims?: any) =>
	await authClient.setCustomUserClaims(uid, claims).then((e) => console.log(e));

const destroyToken = async (address: string) => await authClient.revokeRefreshTokens(address);

const getUidbyEmail = async (email: string) =>
	await authClient.getUserByEmail(`${email}@metamask.io`).then((user) => user.uid);

const getClaimsbyUid = async (uid: string) =>
	await authClient.getUser(uid).then(async (user) => {
		const obj = {};
		try {
			for (let i = 0; i < validClaims.length; i++) {
				obj[validClaims[i]] = user.customClaims[validClaims[i]];
			}
			return obj;
		} catch (error) {
			return obj;
		}
	});
const getAddressbyUid = async (uid: string) => {
	const user = await authClient.getUser(uid);
	const email = user.email;
	const [address, _] = email.split('@');
	return address;
};
const listAllUsers = async () => await authClient.listUsers(1).then((users) => users);

const decodeToken = async (token: string) => {
	if (!token || token === 'null' || token === 'undefined') return null;
	try {
		const decoded = await authClient.verifyIdToken(token);
		return decoded;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const revokeToken = async (uid: string) => await authClient.revokeRefreshTokens(uid);

const sessionCookie = async (token: string) => {
	if (!token || token === 'null' || token === 'undefined') return null;
	return await authClient
		.createSessionCookie(token, { expiresIn: 60 * 60 * 24 * 5 * 1000 }) // 5 days cookie
		.then((cookie) => cookie);
};

const verifyCookie = async (cookie: string) => {
	if (!cookie || cookie === 'null' || cookie === 'undefined') return null;

	try {
		return await authClient.verifySessionCookie(cookie, true).then((user) => user);
	} catch (error) {
		console.log(error);
		return null;
	}
};

export {
	createUser,
	checkUser,
	addClaims,
	destroyToken,
	getUidbyEmail,
	getClaimsbyUid,
	listAllUsers,
	decodeAddress,
	getAddressbyUid,
	decodeToken,
	revokeToken,
	sessionCookie,
	verifyCookie
};
