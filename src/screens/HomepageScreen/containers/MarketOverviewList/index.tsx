import { Decimal } from 'components/Decimal';
import { LoadingGif } from 'components/LoadingGif';
import { QUOTE_CURRENCIES } from 'constants/index';
import { useTranslate } from 'hooks/useTranslate';
import _toLower from 'lodash/toLower';
import toNumber from 'lodash/toNumber';
import _toUpper from 'lodash/toUpper';
import { Currency, selectMarkets, selectMarketsLoading, selectMarketTickers } from 'modules';
import { divide, plus } from 'number-precision';
import React from 'react';
import { useSelector } from 'react-redux';
import { MarketOverviewItem } from '../../components/MarketOverviewItem';
import { DEFAULT_TICKER } from '../HomeMarketHotList';
import { TTab } from '../MarketOverview';
interface MarketOverviewListProps {
	currentTab: TTab;
	currenciesRender: Currency[];
}
export const DEFAULT_MARKET = {
	id: '',
	marketID: '',
	last_price: '',
	price_change_percent: '',
	volume: 0,
	baseCurrency: '',
	quoteCurrency: '',
	high: '+0.00',
	low: '+00.00%',
	isDecreasing: false,
	amount_precision: 0,
};

export const MarketOverviewList = React.memo((props: MarketOverviewListProps) => {
	// get attributes from props
	const { currentTab, currenciesRender } = props;

	// selector
	const loadingMarkets = useSelector(selectMarketsLoading);
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);

	// custom hooks
	const translate = useTranslate();

	// sum volume and get price usd of currency
	const getInfoCurrency = (currency_id: string) => {
		const allBaseMarket = getAllMarketByBaseCurrency(currency_id);

		if (!allBaseMarket.length) {
			return {
				...DEFAULT_MARKET,
				priceUSD: 0,
				totalVolume: 0,
				position: 0,
			};
		}
		const info = currenciesRender.find(currency => currency.id === _toLower(currency_id));
		const { price_change_percent, isDecreasing } = allBaseMarket.find(market => market.id.includes('usdt')) || DEFAULT_MARKET;

		const totalVolume = allBaseMarket.reduce((volume, curr) => {
			return plus(+volume, curr.baseVolume);
		}, 0);

		return {
			...allBaseMarket[0],
			priceUSD: info?.price || 0,
			position: toNumber(info?.position),
			totalVolume,
			price_change_percent,
			isDecreasing,
		};
	};

	const getAllMarketByBaseCurrency = (currency = '') => {
		return markets
			.filter(
				market =>
					market.base_unit.toLowerCase().includes(currency.toLowerCase()) &&
					!QUOTE_CURRENCIES.includes(currency.toLowerCase()),
			)
			.map(market => {
				const market_id = market ? _toUpper(market.name) : '';
				const id = market.id;
				const last = market
					? Decimal.format((marketTickers[market.id] || DEFAULT_TICKER).last, market.price_precision)
					: '0.00';
				const open = market ? (marketTickers[market.id] || DEFAULT_TICKER).open : '0.00';
				const price_change_percent = market ? (marketTickers[market.id] || DEFAULT_TICKER).price_change_percent : '0.00%';
				const volume = market
					? Decimal.format((marketTickers[market.id] || DEFAULT_TICKER).volume, market.amount_precision)
					: '0.00';

				const high = Decimal.format(Number((marketTickers[market.id] || DEFAULT_TICKER).high), market.price_precision);
				const low = Decimal.format(Number((marketTickers[market.id] || DEFAULT_TICKER).low), market.price_precision);
				const change = +last - +open;
				const baseCurrency = market_id.split('/')[0];
				const quoteCurrency = market_id.split('/')[1];
				const baseVolume = divide(toNumber(volume), toNumber(marketTickers[market.id]?.last)) || 0;

				return {
					id,
					marketID: market_id,
					last_price: last,
					price_change_percent,
					baseVolume: baseVolume,
					baseCurrency,
					quoteCurrency,
					high,
					low,
					isDecreasing: +(change || 0) < 0,
					amount_precision: market.amount_precision,
				};
			});
	};
	const getMarketsByTab = React.useCallback(() => {
		const LIMIT = 10;
		return currenciesRender
			.map(currency => getInfoCurrency(currency.id))
			.filter(currency => currency.id !== '')
			.sort((prev, next) => {
				switch (currentTab) {
					case 'Top Gainers':
						return +next.price_change_percent.replace('%', '') - +prev.price_change_percent.replace('%', '');
					case 'Top Losers':
						return +prev.price_change_percent.replace('%', '') - +next.price_change_percent.replace('%', '');
					case 'Value Leaders':
						return +next.last_price - +prev.last_price;
					case 'New Coins':
						return +next.position - +prev.position;
				}

				// return toNumber(next?.volume) - toNumber(prev?.volume);
			})
			.slice(0, LIMIT);
	}, [currentTab, currenciesRender.length, markets, marketTickers]);

	return (
		<div className="market-overview-list">
			<table className="table-data">
				<thead>
					<tr>
						<th>{translate('page.homePage.marketOverview.table.header.Name')}</th>
						<th>{translate('page.homePage.marketOverview.table.header.LastPrice')} (USD)</th>
						<th>24H {translate('page.homepage.marketOverview.table.header.Change')} </th>
						<th>24H {translate('page.homePage.marketOverview.table.header.Value')} (USD)</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<td colSpan={1000}></td>
					{!loadingMarkets &&
						getMarketsByTab().map((market, index) => (
							<MarketOverviewItem
								{...market}
								key={index}
								markets={getAllMarketByBaseCurrency(market.baseCurrency)}
								priceUSD={market.priceUSD}
								totalVolume={+market.totalVolume}
							/>
						))}
				</tbody>
			</table>
			{loadingMarkets && (
				<div
					className="d-flex justify-content-center align-items-center"
					style={{
						minHeight: '400px',
					}}
				>
					<LoadingGif />
				</div>
			)}
		</div>
	);
});
