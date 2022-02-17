import { browser } from '$app/env';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';

import {
	getAuth,
	signInWithCustomToken,
	onAuthStateChanged,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
	linkWithPopup,
	unlink,
	onIdTokenChanged
} from 'firebase/auth';
import { base } from '$app/paths';
import { currentUser, firebaseEnv, isLoggingIn, signature } from '$lib/stores';
import { get } from 'svelte/store';
import { firebaseConfig } from '$lib/contants';
import { ethereum } from '../web3';
// console.log('firebase');

const firebaseApp: any =
	browser && (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());
const db: any = browser && getFirestore();
firebaseEnv.set({
	firebaseControlled: firebaseApp && true
});

async function loginWithGoogle() {
	const provider = new GoogleAuthProvider();
	const auth = getAuth();

	signInWithPopup(auth, provider)
		.then(async (result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			const idToken = await auth.currentUser.getIdToken(true);
			console.log({ idToken });
			const { success } = await setToken(idToken);
			if (success) {
				window.location.reload();
			}
			currentUser.set({
				user,
				uid: user.uid
			});
			// ...
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});
}

async function metamaskSignIn() {
	const auth = getAuth();
	const { address }: any = get(currentUser);
	// let address: any = '';
	// currentUser.subscribe((e) => (address = e.address));

	isLoggingIn.set(true);
	let message = '';
	signature.subscribe((e) => (message = e));
	// console.log({ message });
	let { token, uid, upgraded } = await fetch(`${base}/api/login`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message })
	})
		.then((e) => e.json())
		.then((e) => e);

	if (token) {
		signInWithCustomToken(auth, token)
			.then(async (creds: any) => {
				// Signed in..
				// console.log(user);

				// console.log({ creds });
				currentUser.set({
					user: creds.user,
					uid
				});
				isLoggingIn.set(false);
				const idTokenResult = await auth.currentUser.getIdTokenResult(true);
				const { success } = await setToken(idTokenResult.token);
				if (success) {
					window.location.reload();
				}
				// // console.log(result);
				return { creds };
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(error);
				// ...
			});
	}
}

async function linkProviders() {
	const { address }: any = get(currentUser);
	const { user } = get(currentUser);

	const provider = new GoogleAuthProvider();
	const auth = getAuth();

	linkWithPopup(auth.currentUser, provider)
		.then(async (result) => {
			// Accounts successfully linked.

			const user = result.user;
			const credential = GoogleAuthProvider.credentialFromResult(result);

			currentUser.set({
				user,
				uid: user.uid
			});
		})
		.catch((error) => {
			// Handle Errors here.
			// ...
		});
}

async function unLinkProviders() {
	const { address }: any = get(currentUser);
	const auth = getAuth();
	unlink(auth.currentUser, GoogleAuthProvider.PROVIDER_ID)
		.then((e) => {
			// Auth provider unlinked from account
			// ...
			console.log(e);
		})
		.catch((error) => {
			// An error happened
			// ...
		});
}

const logOut = async ({ reload = true }) => {
	const auth = getAuth();
	await setToken('');
	await signOut(auth);
	reload && window.location.reload();
};
const authChanged = () => {
	// const { address }: any = get(currentUser);
	// store is hot here so cannot use get(currentUser)

	const auth = getAuth();

	onIdTokenChanged(auth, async (user) => {
		// setPersistence(auth, browserSessionPersistence).then(() => signIn());

		if (user) {
			const uid = user.uid;
			currentUser.set({
				user,
				uid: user.uid
			});
		} else {
			// User is signed out
			// ...
			await setToken('');
			currentUser.set({
				user: null,
				uid: null
			});
		}
	});
};

async function setToken(token: string) {
	return await fetch(`${base}/api/getcookie`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ token })
	}).then((e) => e.json());
}

const readDoc = async (path: string) => {
	let [collection, document] = path.split('/');
	const docRef = doc(db, collection, document);
	const docSnap = await getDoc(docRef);
	try {
		if (docSnap.exists()) {
			return docSnap.data();
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!');
		}
	} catch (e) {
		console.log('Error getting document:', e);
		return { e };
	}
};

export {
	firebaseApp,
	db,
	metamaskSignIn,
	loginWithGoogle,
	readDoc,
	logOut,
	authChanged,
	linkProviders,
	unLinkProviders
};
