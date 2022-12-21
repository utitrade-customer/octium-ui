import { preciseData } from 'helpers';
import { IBalance } from 'modules';

export interface IBalanceRender {
	currency: string;
	locked: string;
	balance: string;
	total: string;
	fixed: number;
}

export const calcWalletsFundingData = (wallets: IBalance[], precision = 6) => {
	const data: IBalanceRender[] = [];

	const currencyDict = [];
	for (const wallet of wallets) {
		currencyDict[wallet.currency] = wallet;
	}

	for (const wallet of wallets) {
		let totalBalance = Number(wallet.balance) || 0;
		let totalLocked = Number(wallet.locked) || 0;

		data.push({
			...wallet,
			total: preciseData(Number(totalBalance + totalLocked), precision).toString(),
			balance: preciseData(Number(totalBalance), precision).toString(),
			locked: preciseData(Number(totalLocked), precision).toString(),
			fixed: precision,
		});
	}

	return data;
};
