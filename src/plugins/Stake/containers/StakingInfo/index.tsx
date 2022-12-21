import { CurrencyIcon } from 'components/CurrencyIcon';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Market, marketsFetch, selectMarkets, selectStakeHistoriesLoading, setCurrentMarket } from '../../../../modules';
import { LoadingSpinner } from '../../components';

interface StakingInfoProps {
	currency_id: string;
	staking_name: string;
	description?: string;
	ref_link?: string;
}

export const StakingInfo: React.FC<StakingInfoProps> = (props: StakingInfoProps) => {
	const intl = useIntl();
	const { staking_name, description, currency_id, ref_link } = props;

	const markets = useSelector(selectMarkets);
	const dispatch = useDispatch();
	const history = useHistory();
	const dispatchFetchMarkets = () => dispatch(marketsFetch());
	React.useEffect(() => {
		dispatchFetchMarkets();
	}, []);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.base_unit === id);
		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push({ pathname: `/market/${currentMarket.id}` });
		}
	};

	const isLoadingStakingList = useSelector(selectStakeHistoriesLoading);

	return (
		<div id="staking-info">
			<div className="row">
				<div id="event" className="col-10 d-flex flex-row">
					<div className="event-image">
						<CurrencyIcon currency_id={currency_id} alt={currency_id} />
					</div>
					<div className="event-info">
						<span className="event-info__name">{staking_name}</span>
						<span className="event-info__description">{description}</span>
					</div>
				</div>
				<div className="col-2 buttons">
					<button className="trade-btn" onClick={() => handleRedirectToTrading(currency_id.toLowerCase())}>
						{intl.formatMessage({ id: `stake.detail.info.button.trade` })} {currency_id.toUpperCase()}
					</button>
					<a rel="noopener noreferrer" target="_blank" href={ref_link} className="view-detail-btn btn">
						{intl.formatMessage({ id: `stake.detail.info.button.detail` })}
					</a>
				</div>
			</div>
			<LoadingSpinner loading={isLoadingStakingList} />
		</div>
	);
};
