import { CloseIcon } from 'assets/images/CloseIcon';
import { Decimal } from 'components';
import { localeDate, setTradeColor } from 'helpers';
import {
	openOrdersCancelFetch,
	selectCurrentMarket,
	selectOpenOrdersList,
	selectUserLoggedIn,
	userOpenOrdersFetch,
} from 'modules';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { OpenOrdersStyle } from './styles';
import { TableOrder } from './TableOrder';

// tslint:disable-next-line: no-empty-interface
interface OpenOrderProps {
	marketName: string;
}

export const OpenOrders: React.FC<OpenOrderProps> = ({ marketName }) => {
	const dispatch = useDispatch();
	const { market } = useParams<{ market: string }>();
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const currentMarket = useSelector(selectCurrentMarket);
	const list = useSelector(selectOpenOrdersList);

	const intl = useIntl();

	React.useEffect(() => {
		if (userLoggedIn && currentMarket) {
			dispatch(userOpenOrdersFetch({ market: currentMarket }));
		}
	}, [currentMarket]);

	const handleCancel = (index: number) => {
		const orderToDelete = list[index];
		dispatch(openOrdersCancelFetch({ order: orderToDelete, list }));
	};

	// const getType = (side: string, orderType: string) => {
	// 	if (!side || !orderType) {
	// 		return '';
	// 	}

	// 	return intl.formatMessage({ id: `page.body.openOrders.header.orderType.${side}.${orderType}` });
	// };

	const renderHeaders = () => {
		const currentAskUnit = currentMarket ? ` (${currentMarket.base_unit.toUpperCase()})` : '';
		const currentBidUnit = currentMarket ? ` (${currentMarket.quote_unit.toUpperCase()})` : '';

		return [
			intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.date' }),
			intl.formatMessage({ id: 'page.body.marketsTable.header.pair' }),
			intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.type' }),
			intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.side' }),
			intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.price' }).concat(currentBidUnit),
			intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.amount' }).concat(currentAskUnit),
			intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.total' }).concat(currentBidUnit),
			intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.filled' }),
			'',
		];
	};

	const renderData = () => {
		return list
			.filter(item => item.market === market)
			.map((item, i) => {
				const { id, price, created_at, remaining_volume, origin_volume, side, ord_type } = item;
				const executedVolume = Number(origin_volume) - Number(remaining_volume);
				const remainingAmount = Number(remaining_volume);
				const total = Number(origin_volume) * Number(price);
				const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
				const priceFixed = currentMarket ? currentMarket.price_precision : 0;
				const amountFixed = currentMarket ? currentMarket.amount_precision : 0;
				// const orderType = getType(side, ord_type ? ord_type : '');

				return [
					localeDate(created_at, 'fullDate'),
					<span style={{ color: setTradeColor(side).color }} key={id}>
						{marketName}
					</span>,
					<span style={{ color: setTradeColor(side).color }} key={id}>
						{ord_type}
					</span>,
					<span style={{ color: setTradeColor(side).color }} key={id}>
						{side}
					</span>,
					<span style={{ color: setTradeColor(side).color }} key={id}>
						{Decimal.formatRemoveZero(price, priceFixed)}
					</span>,
					<span style={{ color: setTradeColor(side).color }} key={id}>
						{Decimal.formatRemoveZero(remainingAmount, amountFixed)}
					</span>,
					<span style={{ color: setTradeColor(side).color }} key={id}>
						{Decimal.formatRemoveZero(total, amountFixed)}
					</span>,
					<span style={{ color: setTradeColor(side).color }} key={id}>
						{filled}%
					</span>,
					<CloseIcon onClick={() => handleCancel(i)} />,
				];
			});
	};

	return (
		<OpenOrdersStyle>
			<TableOrder headersKeys={renderHeaders()} data={renderData()} />
		</OpenOrdersStyle>
	);
};
