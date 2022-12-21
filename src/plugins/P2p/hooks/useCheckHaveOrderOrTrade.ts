import { useMemo } from 'react';
import { useP2PPrivateListOrders } from './useListPrivateOrders';
import { useP2pMyTradeNewItem } from './useP2pMyTradeNewItem';

interface IUseCheckHaveOrderOrTrade {
	isHaving: boolean;
	isLoading: boolean;
}

export const useCheckHaveOrderOrTrade = (): IUseCheckHaveOrderOrTrade => {
	const { isLoading: isLoadingAds, listOrders } = useP2PPrivateListOrders({
		status: 'trading',
	});

	const { isLoading: isLoadingTrade, listItem } = useP2pMyTradeNewItem();

	const isHaving = useMemo(() => {
		if (isLoadingAds || isLoadingTrade) {
			return true;
		}

		return listOrders.length > 0 || listItem.length > 0;
	}, [isLoadingAds, listOrders, listItem]);

	return { isHaving: isLoadingAds || isLoadingTrade || isHaving, isLoading: isLoadingAds || isLoadingTrade };
};
