import { formatEther } from 'ethers/lib/utils';
import { BigNumber, ethers } from 'ethers';
import { browser } from '$app/env';
import { secureMessage } from '$lib/contants';

async function getPrice(lock: any) {
	try {
		return formatEther(BigNumber.from(await lock.keyPrice()));
	} catch (e) {
		return e;
	}
}
async function purchase(lock: any, signer: any, account: string) {
	const contractWithSigner = lock.connect(signer);
	try {
		const tx = await contractWithSigner.purchase(
			BigNumber.from(await lock.keyPrice()),
			account,
			browser && ethers.constants.AddressZero,
			[],
			{
				value: BigNumber.from(await lock.keyPrice()),
				gasLimit: 250000
			}
		);
		return { tx };
	} catch (e) {
		return { e };
	}
}
async function checkSubscription(lock: any, account: string) {
	return await lock.getHasValidKey(account);
}



export { getPrice, purchase, checkSubscription,  };
