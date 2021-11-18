// ethers stub
import { ethers } from 'ethers';
import ABI from '$lib/contract.abi.json';
import { CONTRACT } from '$lib/unlock';
import { contract, rpcProvider } from '$lib/contants';
const provider = new ethers.providers.JsonRpcProvider(rpcProvider);
const signer = provider.getSigner(0);
const CONTRACT_ADDRESS = contract;

export const validKey = async (account: string) => {
	const lock = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
	return await lock.getHasValidKey(account);
};
