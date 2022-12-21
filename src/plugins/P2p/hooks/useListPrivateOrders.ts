import { isNil, omitBy } from 'lodash';
import {
	IP2PPrivateOrder,
	IPrivateOrderFetchParams,
	p2pPrivateOrdersFetch,
	selectPrivateOrders,
	selectPrivateOrdersLoading,
} from 'modules/plugins/p2p/orders';
import { Meta } from 'modules/plugins/p2p/type/interface.common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2PPrivateListOrders {
	listOrders: IP2PPrivateOrder[];
	isLoading: boolean;
	meta: Meta;
}

const defaultLimitItem = 10;

export const useP2PPrivateListOrders = (props: Partial<IPrivateOrderFetchParams>): IUseP2PPrivateListOrders => {
	const { currency, fiat, page, orderMin, payment, type, status, startAt, endAt } = props;
	const validCallPrivate = useCallPrivateApi();

	const dispatch = useDispatch();

	const loading = useSelector(selectPrivateOrdersLoading);
	const listOrders = useSelector(selectPrivateOrders);

	useEffect(() => {
		if (!loading && props && validCallPrivate) {
			dispatch(
				p2pPrivateOrdersFetch(
					omitBy(
						{
							fiat: fiat && fiat.toLocaleLowerCase(),
							currency: currency && currency.toLocaleLowerCase(),
							limit: defaultLimitItem,
							page,
							orderMin,
							payment,
							type,
							sort: 'createdAt:DESC',
							status: status,
							startAt,
							endAt,
						},
						isNil,
					),
				),
			);
		}
	}, [currency, fiat, page, orderMin, payment, type, validCallPrivate, status, startAt, endAt]);

	return { listOrders: listOrders.data, meta: listOrders.meta, isLoading: loading };
};
