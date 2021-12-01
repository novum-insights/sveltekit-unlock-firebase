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
	unlink
} from 'firebase/auth';
import { base } from '$app/paths';
import { currentUser, firebaseEnv, isLoggingIn, signature } from '$lib/stores';
import { get } from 'svelte/store';
import { firebaseConfig } from './contants';
import { ethereum } from './web3';
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
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;

			currentUser.set({
				address: '',
				user,
				loggedIn: true,
				uid: user.uid,
				upgraded: false
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
	// const { address }: any = get(currentUser);
	// let address: any = '';
	// currentUser.subscribe((e) => (address = e.address));
	
	isLoggingIn.set(true);
	let message = '';
	signature.subscribe((e) => (message = e));
	console.log({ message });
	let { token, uid, upgraded } = await fetch(`${base}/api/address`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message })
	})
		.then((e) => e.json())
		.then((e) => e);
	if (token && uid) {
		signInWithCustomToken(auth, token)
			.then(async (creds: any) => {
				// Signed in..
				// console.log(user);
				// const result = await auth.currentUser.getIdTokenResult(true);
				// console.log(result.claims);
				// console.log(token);

				currentUser.set({
					address: uid,
					user: creds.user,
					loggedIn: false,
					uid,
					upgraded
				});
				isLoggingIn.set(false);

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
				upgraded: false,
				address,
				user,
				loggedIn: true,
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

const logOut = async () => {
	const auth = getAuth();
	// await fetch('logout');

	//refresh on logout
	window.location.reload();
	await signOut(auth)
		.then(() => {})
		.catch((error) => {
			console.log(error);
		});
};
const authChanged = () => {
	// const { address }: any = get(currentUser);
	// store is hot here so cannot use get(currentUser)
	let address: any = '';
	currentUser.subscribe((e) => (address = e.address));

	const auth = getAuth();

	onAuthStateChanged(auth, async (user) => {
		// setPersistence(auth, browserSessionPersistence).then(() => signIn());

		const { upgraded } =
			ethereum && address
				? await fetch(`${base}/api/validkey`, {
						method: 'post',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ address })
				  }).then((e) => e.json())
				: false;
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			// ...

			currentUser.set({
				address,
				user,
				loggedIn: true,
				uid: user.uid,
				upgraded
			});
		} else {
			// User is signed out
			// ...

			currentUser.set({
				address,
				user: null,
				loggedIn: false,
				uid: null,
				upgraded: false
			});
		}
	});
};

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
