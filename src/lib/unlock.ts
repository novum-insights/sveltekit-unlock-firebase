import { ethers, providers, Signer } from 'ethers';
import { browser } from '$app/env';
const ethereum = browser && window['ethereum'];
const provider = browser && ethereum && new ethers.providers.Web3Provider(ethereum);
const chain = browser && ethereum && ethereum.networkVersion;
const signer = browser && ethereum && provider.getSigner();

const CONTRACT = (address: string, abi: any, prov: providers.Provider | Signer) =>
	new ethers.Contract(address, abi, prov);

export { ethereum, provider, chain, signer, CONTRACT };
