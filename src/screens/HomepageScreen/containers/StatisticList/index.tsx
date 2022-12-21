import { formatNumberStandard } from 'helpers/formatNumberStandard';
import { useTranslate } from 'hooks/useTranslate';
import _, { toNumber } from 'lodash';
import { Currency, selectMarkets, selectMarketTickers } from 'modules';
import { selectStatistics, statisticFetch } from 'modules/plugins/info/statistic';
import { plus, times } from 'number-precision';
import React from 'react';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';

interface StatisticListProps {
	currencies: Currency[];
}
export const StatisticList = React.memo((props: StatisticListProps) => {
	const { currencies } = props;
	const dispatch = useDispatch();
	// selectors
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);
	const statistics = useSelector(selectStatistics);
	const delay = 0.25;

	// side-effects
	React.useEffect(() => {
		dispatch(statisticFetch());
	}, []);

	// custom hooks
	const translate = useTranslate();

	const getTotalValue = () => {
		const totalVolume = markets.reduce((volume, curr) => {
			const price = _.find(currencies, { id: curr.quote_unit })?.price || 0;
			const quoteVolume = times(marketTickers[curr.id]?.volume || 0, price);
			return plus(+volume, quoteVolume);
		}, 0);
		return totalVolume;
	};

	const render24Value = () => {
		const precision = 2;
		const milestone = 1_000;
		const result = formatNumberStandard({
			value: getTotalValue(),
			precision,
			milestone,
		});
		const number = result.substring(0, result.length - 1);
		let unit = '';
		if (getTotalValue() > milestone) unit = result[result.length - 1];

		return (
			<div>
				<CountUp enableScrollSpy end={toNumber(number)} decimals={2} start={0} duration={2} delay={delay} />
				{unit}
			</div>
		);
	};
	return (
		<div className="home-statistic-list">
			<div className="d-flex justify-content-between align-items-center ">
				<div className="statistic__item">
					<div className="statistic__item-amount">
						<CountUp
							enableScrollSpy
							end={statistics.currencies || currencies.length}
							start={0}
							duration={2}
							delay={delay}
						/>
					</div>
					<div className="statistic__item-label">{translate('page.homepage.statistic.coins')}</div>
				</div>
				<div className="statistic__item">
					<div className="statistic__item-amount">
						<CountUp
							enableScrollSpy
							end={statistics.markets || markets.length}
							start={0}
							duration={2}
							delay={delay}
						/>
					</div>
					<div className="statistic__item-label">{translate('page.homepage.statistic.Markets')}</div>
				</div>
				<div className="statistic__item">
					<div className="statistic__item-amount">{render24Value()}</div>
					<div className="statistic__item-label">
						24H {translate('page.homePage.marketOverview.table.header.Value')} (USD)
					</div>
				</div>
				<div className="statistic__item">
					<div className="statistic__item-amount">
						{<CountUp end={statistics.members} start={0} duration={2} delay={0.5} />}
					</div>
					<div className="statistic__item-label">{translate('page.homepage.statistic.User')}</div>
				</div>
			</div>
		</div>
	);
});
