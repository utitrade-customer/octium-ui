import { Decimal } from 'components';
import { DEFAULT_CURRENCY_PRECISION, VALUATION_PRIMARY_CURRENCY } from '../../../constants';
import { currenciesFetch, selectCurrencies } from 'modules';
import { p2pValueBalancesFetch, selectP2pValueBalances, selectP2pValueBalancesLoading } from 'modules/plugins/p2p/balances';
import NP from 'number-precision';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2Balances {
	totalUsd: string;
	totalBTC: string;
}

export const useP2PValueBalances = (): IUseP2Balances => {
	const [totalUsd, setTotalUsd] = useState('');
	const [totalBTC, setTotalBTC] = useState('');

	const dispatch = useDispatch();
	const isLoading = useSelector(selectP2pValueBalancesLoading);
	const listBalance = useSelector(selectP2pValueBalances);
	const currencies = useSelector(selectCurrencies);
	const validCallPrivate = useCallPrivateApi('low');

	useEffect(() => {
		if (!isLoading && validCallPrivate) {
			dispatch(p2pValueBalancesFetch());
		}
		dispatch(currenciesFetch());
	}, [validCallPrivate]);

	useEffect(() => {
		let totalUsdTmp = 0;

		if (!isLoading) {
			const currencyBTC = currencies.find(e => e.id.toLowerCase() === VALUATION_PRIMARY_CURRENCY.toLowerCase());
			listBalance.data.forEach(coin => {
				const currency = currencies.find(e => e.id.toLowerCase() === coin.currency.toLowerCase());

				totalUsdTmp =
					totalUsdTmp +
					(currency === undefined
						? 0
						: +Decimal.formatRemoveZero(
								currency.price * NP.plus(+coin.balance, +coin.locked),
								DEFAULT_CURRENCY_PRECISION,
						  ));
			});
			setTotalUsd(Decimal.format(totalUsdTmp, DEFAULT_CURRENCY_PRECISION));

			if (currencyBTC) {
				setTotalBTC(Decimal.format(NP.divide(totalUsdTmp, currencyBTC.price), DEFAULT_CURRENCY_PRECISION));
			}
		}
	}, [listBalance.data, isLoading, currencies]);

	return { totalUsd, totalBTC };
};
