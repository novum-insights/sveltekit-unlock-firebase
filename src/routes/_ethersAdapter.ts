import Web3 from 'web3';

import type { AbiItem } from 'web3-utils';

import ABI from '$lib/contract.abi.json';

import { contract, rpcProvider } from '$lib/contants';

const provider = new Web3.providers.HttpProvider(rpcProvider);
const CONTRACT_ADDRESS = contract;

export const validKey = async (account: string) => {
	const web3 = new Web3(provider);
	const lock = new web3.eth.Contract(ABI as AbiItem[], CONTRACT_ADDRESS);
	return await lock.methods.getHasValidKey(account).call();
};

export const verifyMessage = async (message: string, signature: string) => {
	const web3 = new Web3(provider);
	return web3.eth.accounts.recover(message, signature);
};

export const transaction = async (hash: string) => {
	const web3 = new Web3(provider);
	return await web3.eth.getTransactionReceipt(hash);
};

export const getBalance = async (account: string) => {
	const web3 = new Web3(provider);
	return await web3.eth.getBalance(account);
};
