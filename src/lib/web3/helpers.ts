import { ethereum } from '.';

async function connect() {
	try {
		return await ethereum.request({
			method: 'eth_requestAccounts'
		});
		// return accounts[0];
	} catch (e) {
		console.log(e.message);
		return e.message;
	}
}

async function requestNetwork({ chainId }) {
	try {
		// check if the chain to connect to is installed
		await ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId }] // chainId must be in hexadecimal numbers
		});
	} catch (error) {
		// This error code indicates that the chain has not been added to MetaMask
		// if it is not, then install it into the user MetaMask
		// if (error.code === 4902) {
		// 	try {
		// 		await ethereum.request({
		// 			method: 'wallet_addEthereumChain',
		// 			params: [
		// 				{
		// 					chainId: '0x61',
		// 					rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
		// 				}
		// 			]
		// 		});
		// 	} catch (addError) {
		// 		console.error(addError);
		// 	}
		// }
		console.error(error);
		return error;
	}
}

export { connect, requestNetwork };
