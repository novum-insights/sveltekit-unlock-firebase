const contract = '0x3f496D438aE2520ee839f3909ECeCcA40B4B22D3';
const firebaseConfig = {
	apiKey: 'AIzaSyCbe_JcavxB96BW0K3QQ0vFWiIzzhtTksQ',
	authDomain: 'unlockprotocoldev.firebaseapp.com',
	projectId: 'unlockprotocoldev',
	storageBucket: 'unlockprotocoldev.appspot.com',
	messagingSenderId: '784966174148',
	appId: '1:784966174148:web:4cf4f36702e7b1aa189091'
};
const rpcProvider: any = import.meta.env.VITE_RPC_PROVIDER;
const secureMessage: any = import.meta.env.VITE_SECURE_MESSAGE;
const firebaseAdmin: any = import.meta.env.VITE_FIREBASE_ADMIN;
export { contract, firebaseConfig, rpcProvider, secureMessage, firebaseAdmin };
