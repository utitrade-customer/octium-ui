import { ConvertUsd, Decimal } from 'components';
import { CurrencyIcon } from 'components/CurrencyIcon';
import { useMarketsFetch, useMarketsTickersFetch } from 'hooks';
import _toUpper from 'lodash/toUpper';
import { currenciesFetch, selectMarkets, selectMarketTickers } from 'modules';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Slider, { Settings } from 'react-slick';

export const DEFAULT_TICKER = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
	avg_price: '0',
};

const MARKET_SHOW = 4;
const BASE_CURRENCY = 'usdt';
export const HomeMarketHotList = React.memo(() => {
	// init hooks
	const dispatch = useDispatch();
	const history = useHistory();

	// init selectors
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);

	// !Side effects
	useMarketsFetch();
	useMarketsTickersFetch();

	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, [dispatch]);

	// ! IFE for render market hot list
	const marketRender = (() => {
		const marketState = markets
			.filter(market => market.quote_unit.toLowerCase().includes(BASE_CURRENCY))
			.map(market => {
				// market_id => EX: BTC/USDT
				// ID => BTCUSDT
				const market_id = market ? _toUpper(market.name) : '';
				const id = market.id;
				const last = market
					? Decimal.format((marketTickers[market.id] || DEFAULT_TICKER).last, market.price_precision)
					: '0.00';
				const open = market ? (marketTickers[market.id] || DEFAULT_TICKER).open : '0.00';
				const price_change_percent = market ? (marketTickers[market.id] || DEFAULT_TICKER).price_change_percent : '0.00%';
				const volume = market
					? Decimal.format((marketTickers[market.id] || DEFAULT_TICKER).volume, market.amount_precision)
					: '0,00 -';
				const change = +last - +open;
				const baseCurrency = market_id.split('/')[0];
				const quoteCurrency = market_id.split('/')[1];

				const marketChangeColor = +(change || 0) < 0 ? 'var(--system-red)' : 'var(--system-green)';
				return {
					id,
					marketID: market_id,
					last_price: last,
					price_change_percent,
					volume,
					marketChangeColor,
					baseCurrency,
					quoteCurrency,
				};
			});

		const mod = marketState.length % MARKET_SHOW;
		const newList = [...marketState, ...marketState.slice(2, !mod ? 2 : MARKET_SHOW - mod + 2)];
		if (newList.length === 0) {
			return Array.from({
				length: MARKET_SHOW,
			}).fill({
				id: '',
				marketID: '',
				last_price: '0.00',
				price_change_percent: '0.00%',
				volume: '0.00',
				marketChangeColor: 'var(--system-green)',
				baseCurrency: '',
				quoteCurrency: '',
			}) as typeof newList;
		}
		return newList;
	})();

	const settingsSlider: Settings = {
		dots: false,
		infinite: marketRender.length > MARKET_SHOW,
		arrows: false,
		slidesToShow: MARKET_SHOW,
		slidesToScroll: 1,
		vertical: true,
		verticalSwiping: true,
		swipeToSlide: true,
		autoplay: true,
		autoplaySpeed: 2000,
		speed: 1500,
		adaptiveHeight: true,
		draggable: true,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				},
			},
		],
	};
	// * Component Market Item
	const MarketItem = (market: typeof marketRender[0]) => {
		return (
			<div
				className="market-item"
				onClick={() =>
					history.push({
						pathname: `market/${market.id.toLowerCase()}`,
					})
				}
			>
				<div className="market-item-name">
					<CurrencyIcon currency_id={market.baseCurrency} className="market-item-icon" />
					{market.marketID}
					<span className="market-item-change-percent" style={{ color: market.marketChangeColor }}>
						{market.price_change_percent}
					</span>
				</div>

				<div className="market-item-last-price">{market.last_price}</div>
				<div className="market-item-price">
					≈ <ConvertUsd value={+market.last_price} symbol={market.quoteCurrency} />
					<span> USD</span>
				</div>
			</div>
		);
	};
	return (
		<div className="home-markets-hot">
			<Slider {...settingsSlider} className="home-markets-hot__slider">
				{marketRender.map((market, index) => {
					return <MarketItem key={index} {...market} />;
				})}
			</Slider>
		</div>
	);
});
