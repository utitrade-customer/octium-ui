import classNames from 'classnames';
import { CurrencyIcon } from 'components/CurrencyIcon';
import { formatNumber } from 'helpers';
import { formatNumberStandard } from 'helpers/formatNumberStandard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { useTranslate } from 'hooks/useTranslate';
import toNumber from 'lodash/toNumber';
import _toString from 'lodash/toString';
import toUpper from 'lodash/toUpper';
import { selectMarkets, Market, setCurrentMarket } from 'modules';
import { times } from 'number-precision';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface InfoMarket {
	id: string;
	marketID: string;
	last_price: string;
	price_change_percent: string;
	baseVolume: number;
	baseCurrency: string;
	quoteCurrency: string;
	high: string;
	low: string;
	isDecreasing: boolean;
}

interface MarketOverviewItemProps extends Omit<InfoMarket, 'baseVolume'> {
	markets: InfoMarket[];
	priceUSD: number;
	totalVolume: number;
}
export const MarketOverviewItem = (props: MarketOverviewItemProps) => {
	const history = useHistory();

	// init state
	const [isShowMarkets, setIsShowMarket] = React.useState(false);

	// init refs
	const refMarkets = React.useRef<HTMLTableRowElement>(null);
	const refParentMarkets = React.useRef<HTMLTableRowElement>(null);

	// init classNames
	const btnShowMoreClassName = classNames('btn-show-more', {
		'btn-show-more--active': isShowMarkets,
	});

	// custom hooks
	const translate = useTranslate();
	const dispatch = useDispatch();
	useOnClickOutside(refMarkets, e => {
		if (!refParentMarkets.current?.contains(e.target as Node)) {
			setIsShowMarket(false);
		}
	});

	const markets = useSelector(selectMarkets);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);

		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/market/${currentMarket.id}`);
		}
	};

	return (
		<React.Fragment>
			<tr
				ref={refParentMarkets}
				className="home-market-overview-item "
				onClick={() => {
					setIsShowMarket(!isShowMarkets);
				}}
			>
				<td>
					<CurrencyIcon currency_id={props.baseCurrency} className="item-icon" />
					{props.baseCurrency}
				</td>
				<td>{formatNumber(_toString(props.priceUSD))}</td>
				<td
					style={{
						color: props.isDecreasing ? 'var(--system-red)' : 'var(--bids)',
					}}
				>
					{props.price_change_percent}
				</td>
				<td>{formatNumberStandard(times(props.totalVolume, toNumber(props.priceUSD)))}</td>
				<td className={btnShowMoreClassName}>{'>'}</td>
			</tr>

			{isShowMarkets && (
				<tr ref={refMarkets}>
					<td
						colSpan={7}
						style={{
							padding: 0,
						}}
					>
						<div className="home-market-child-list  table-responsive">
							<table>
								<thead>
									<tr>
										<th>{translate('page.homepage.marketOverview.table.header.Market')}</th>
										<th>{translate('page.homePage.marketOverview.table.header.LastPrice')}</th>
										<th>24H {translate('page.homepage.marketOverview.table.header.Change')}</th>
										<th>24H {translate('page.homepage.marketOverview.table.header.Lowest')}</th>
										<th>24H {translate('page.homepage.marketOverview.table.header.Highest')}</th>
										<th>24H {translate('page.homepage.marketOverview.table.header.volume')}</th>
										<th>24H {translate('page.homePage.marketOverview.table.header.Value')}</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{props.markets.map((market, index) => (
										<tr key={index}>
											<td>{market.marketID}</td>
											<td>{formatNumber(Number(market.last_price))}</td>
											<td
												style={{
													color: market.isDecreasing ? 'var(--system-red)' : 'var(--bids)',
												}}
											>
												{market.price_change_percent}
											</td>
											<td> {formatNumber(Number(market.low))}</td>
											<td> {formatNumber(Number(market.high))}</td>
											<td>
												{formatNumberStandard(market.baseVolume)}
												{` ${toUpper(props.baseCurrency)}`}
											</td>
											<td>
												{formatNumberStandard(times(market.baseVolume, props.priceUSD))}
												{' USD'}
											</td>
											<td
												style={{
													color: 'var(--primary)',
													cursor: 'pointer',
												}}
												onClick={() => handleRedirectToTrading(market.id)}
											>
												{translate('page.homepage.marketOverview.btn.trade.text')}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			)}
		</React.Fragment>
	);
};
