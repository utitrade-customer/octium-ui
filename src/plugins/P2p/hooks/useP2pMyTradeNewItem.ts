import {
	IP2pPrivateTrade,
	p2pPrivateTradeItemFetch,
	selectPrivateTradesNewItem,
	selectPrivateTradesNewItemLoading,
} from 'modules';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2pMyTradeNewItem {
	listItem: IP2pPrivateTrade[];
	isLoading: boolean;
}

export const useP2pMyTradeNewItem = (): IUseP2pMyTradeNewItem => {
	const isLoading = useSelector(selectPrivateTradesNewItemLoading);
	const listItem = useSelector(selectPrivateTradesNewItem);

	const validCallPrivate = useCallPrivateApi();

	const dispatch = useDispatch();

	useEffect(() => {
		if (!isLoading && validCallPrivate) {
			dispatch(p2pPrivateTradeItemFetch());
		}
	}, [validCallPrivate]);

	return { listItem, isLoading };
};
