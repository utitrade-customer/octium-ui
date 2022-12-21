import {
	IP2pParamsPrivateTradesFetch,
	IP2pPrivateTrade,
	p2pPrivateTradesFetch,
	selectPrivateTrades,
	selectPrivateTradesLoading,
} from 'modules';
import { IPayload } from 'modules/plugins/p2p/type/interface.common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNil, omitBy } from 'lodash';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2pMyTrades {
	myTrades: IPayload<IP2pPrivateTrade[]>;
	isLoading: boolean;
}

export const useP2pMyTrades = (props: IP2pParamsPrivateTradesFetch): IUseP2pMyTrades => {
	const { limit, page, state, status, startAt, endAt, currency, type } = props;
	const validCallPrivate = useCallPrivateApi();

	const isLoading = useSelector(selectPrivateTradesLoading);
	const myTrades = useSelector(selectPrivateTrades);
	const dispatch = useDispatch();

	useEffect(() => {
		validCallPrivate &&
			dispatch(
				p2pPrivateTradesFetch(
					omitBy(
						{
							type,
							currency,
							limit,
							page,
							sort: 'createdAt:DESC',
							state,
							status,
							startAt,
							endAt,
						},
						isNil,
					),
				),
			);
	}, [limit, page, state, status, validCallPrivate, startAt, endAt, currency, type]);

	return { myTrades, isLoading };
};
