import { IP2PPrivateOrder, selectPrivateInfoItemOrders, p2pPrivateOrdersFindItemFetch } from 'modules';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseGetItemOrder {
	item: IP2PPrivateOrder | undefined;
	isLoading: boolean;
	err: boolean;
}

export const useGetItemOrder = (idItem: string | undefined, patch: string): IUseGetItemOrder => {
	const dispatch = useDispatch();
	const validCallPrivate = useCallPrivateApi();
	const dataItem = useSelector(selectPrivateInfoItemOrders);

	useEffect(() => {
		if (validCallPrivate && idItem && patch.includes('edit-order')) {
			dispatch(p2pPrivateOrdersFindItemFetch({ id: +idItem }));
		}
	}, [idItem, validCallPrivate]);

	return { item: dataItem.payload.data, isLoading: dataItem.loading, err: dataItem.err };
};
