import {
	IItemPublicOrder,
	IP2pPrivateTrade,
	p2pGetInfoTradeFetch,
	p2pInfoTradeResetError,
	p2pPublicOrderItemFetch,
	p2pPublicOrderResetError,
	selectErrorOrderPublic,
	selectErrorP2pTradesDetail,
	selectOrderPublic,
	selectOrderPublicLoading,
	selectP2pTradesDetail,
	selectP2pTradesDetailLoading,
} from 'modules';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2pInTrade {
	infoOrder?: IItemPublicOrder;
	infoTrade?: IP2pPrivateTrade;
	error: boolean;
	isLoading: boolean;
}

export const useP2pInTrade = (tradeId: number): IUseP2pInTrade => {
	const infoTrade = useSelector(selectP2pTradesDetail);
	const isLoadingInfoTrade = useSelector(selectP2pTradesDetailLoading);

	const isLoadingInfoOrder = useSelector(selectOrderPublicLoading);
	const infoOrders = useSelector(selectOrderPublic);

	const errorInfoTrade = useSelector(selectErrorP2pTradesDetail);
	const errorInfoOrder = useSelector(selectErrorOrderPublic);

	const validCallPrivate = useCallPrivateApi();

	const dispatch = useDispatch();

	const infoOrder = infoOrders.data.find(e => e.id === infoTrade?.order);

	useEffect(() => {
		if (validCallPrivate) {
			dispatch(p2pGetInfoTradeFetch({ id: tradeId }));
		}
	}, [validCallPrivate, tradeId]);

	useEffect(() => {
		if (!isLoadingInfoTrade && infoTrade && !isLoadingInfoOrder) {
			if (!infoOrder) {
				dispatch(p2pPublicOrderItemFetch({ id: infoTrade.order }));
			}
		}
	}, [isLoadingInfoTrade, isLoadingInfoOrder, infoTrade, infoOrder]);

	// real
	return {
		infoOrder: infoOrders.data.find(e => e.id === infoTrade?.order),
		infoTrade,
		error: !!errorInfoOrder || !!errorInfoTrade,
		isLoading: isLoadingInfoTrade || isLoadingInfoOrder,
	};
};

export const resetErrorInfoTrade = (dispatch: any) => {
	dispatch(p2pPublicOrderResetError());
	dispatch(p2pInfoTradeResetError());
};
