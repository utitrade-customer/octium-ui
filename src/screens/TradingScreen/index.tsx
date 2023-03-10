import { MarketTrading, NewOrder, NewOrderBook, TradingChart, TradingOrderHistory, TradingTradeHistory } from 'containers';
import { setDocumentTitle } from 'helpers';
import { useDepthFetch } from 'hooks';
import { marketsFetch, selectMarkets, selectUserLoggedIn } from 'modules';
import { rangerConnectFetch } from 'modules/public/ranger';
import { selectRanger } from 'modules/public/ranger/selectors';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderToolbar } from './HeaderToolbar';

// tslint:disable-next-line: no-empty-interface
interface TradingScreenProps {}

const TradingComponent: React.FC<TradingScreenProps> = ({}) => {
	useDepthFetch();
	const dispatch = useDispatch();
	const markets = useSelector(selectMarkets);
	const rangerState = useSelector(selectRanger);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const intl = useIntl();

	React.useEffect(() => {
		const { connected, withAuth } = rangerState;
		setDocumentTitle(intl.formatMessage({ id: 'page.trading.documentTitle' }));
		if (markets.length < 1) {
			dispatch(marketsFetch());
		}

		if (!connected) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}

		if (userLoggedIn && !withAuth) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}
		window.scroll(0, 0);
	}, []);

	return (
		<div className="td-pg-trading">
			<div
				className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__header-toolbar"
				style={{
					borderRadius: '5px',
				}}
			>
				<HeaderToolbar />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__market-trading">
				<MarketTrading />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__order-book">
				<NewOrderBook />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__trading-chart">
				<TradingChart hideHeaderContent />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__order">
				<NewOrder />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__recent-trade">
				<TradingTradeHistory />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__order-history">
				<TradingOrderHistory />
			</div>
		</div>
	);
};

export const TradingScreen = React.memo(TradingComponent, isEqual);
