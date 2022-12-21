import { estimateUnitValue, estimateValue } from 'helpers/estimateValue';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'hooks';
import { selectCurrencies, selectMarkets, selectMarketTickers, selectWallets } from 'modules';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ENUM_WALLET } from 'screens';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { EstimatedP2pValue } from './EstimatedP2pValue';

interface EstimatedValueProps {
	typeWallet: ENUM_WALLET;
}

const EstimatedValue = React.memo((props: EstimatedValueProps) => {
	const { typeWallet } = props;

	const wallets = useSelector(selectWallets);
	const markets = useSelector(selectMarkets);
	const currencies = useSelector(selectCurrencies);
	const tickers = useSelector(selectMarketTickers);
	const estimatedValue = estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
	const estimatedSecondaryValue = estimateUnitValue(
		VALUATION_SECONDARY_CURRENCY,
		VALUATION_PRIMARY_CURRENCY,
		+estimatedValue,
		currencies,
		markets,
		tickers,
	);

	useWalletsFetch();
	useMarketsFetch();
	useCurrenciesFetch();
	useMarketsTickersFetch();

	return (
		<div className="td-mobile-cpn-estimated-value">
			{typeWallet === ENUM_WALLET.SPOT ? (
				<div className="td-mobile-cpn-estimated-value__body">
					<div className="td-mobile-cpn-estimated-value__body-wrap">
						<span className="td-mobile-cpn-estimated-value__body-number">{estimatedValue}</span>
						<span className="td-mobile-cpn-estimated-value__body-currency">
							{VALUATION_PRIMARY_CURRENCY.toUpperCase()}
						</span>
					</div>
					<div className="td-mobile-cpn-estimated-value__body-wrap">
						<span className="td-mobile-cpn-estimated-value__body-number">{estimatedSecondaryValue}</span>
						<span className="td-mobile-cpn-estimated-value__body-currency">
							{VALUATION_SECONDARY_CURRENCY.toUpperCase()}
						</span>
					</div>
				</div>
			) : (
				<EstimatedP2pValue />
			)}
		</div>
	);
});

export { EstimatedValue };
