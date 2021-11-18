import { writable } from 'svelte/store';

export const currentUser = writable({
	address: '',
	user: null,
	loggedIn: false,
	uid: '',
	upgraded: false
});
