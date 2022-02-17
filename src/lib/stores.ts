import { writable } from 'svelte/store';

export const currentUser = writable({
	user: null,
	uid: ''
});

export const firebaseEnv = writable({
	firebaseControlled: false
});

export const isLoggingIn = writable(false);

export const signature = writable('');
