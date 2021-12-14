import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { getBalance } from '../_ethersAdapter';

export async function post({ body }) {
	const address = body.address;
	const balance = await getBalance(address);
	const ethBalance = formatEther(BigNumber.from(balance));
	return {
		body: { ethBalance }
	};
}
