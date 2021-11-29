import { ethers } from 'ethers';
import ABI from '$lib/contract.abi.json';
import { CONTRACT } from '$lib/web3';
import { contract, rpcProvider } from '$lib/contants';

const provider = ethers && new ethers.providers.JsonRpcProvider(rpcProvider);
const CONTRACT_ADDRESS = contract;

export const validKey = async (account: string) => {
	const lock = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
	return await lock.getHasValidKey(account);
};

export const verifyMessage = async (message: string, signature: string) =>
	ethers.utils.verifyMessage(message, signature);
