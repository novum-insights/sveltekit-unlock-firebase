import { writable } from 'svelte/store';

export const currentUser = writable({
	address: '',
	user: null,
	loggedIn: false,
	uid: '',
	upgraded: false
});

export const firebaseEnv = writable({
	firebaseControlled: false
});

export const isLoggingIn = writable(false);

export const signature = writable('');
