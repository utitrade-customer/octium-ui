import {
	IInfoSupported,
	InfoPriceP2p,
	infoPriceSupportedFetch,
	selectPublicInfoPriceP2p,
	selectPublicInfoPriceP2pLoading,
	selectPublicInfosP2p,
	selectPublicInfosP2pLoading,
} from 'modules';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IUseP2pPublicInfos {
	infoPublicOrders: IInfoSupported;
	isLoading: boolean;
}

export const useP2pPublicInfos = (): IUseP2pPublicInfos => {
	const isLoading = useSelector(selectPublicInfosP2pLoading);
	const infoPublicOrders = useSelector(selectPublicInfosP2p);

	return { infoPublicOrders, isLoading };
};

interface IUseP2pPublicPriceInfo {
	infoPrice: InfoPriceP2p;
	isLoading: boolean;
}

export const useP2pPublicPriceRecommend = (currencyId?: string, fiatId?: string): IUseP2pPublicPriceInfo => {
	const isLoading = useSelector(selectPublicInfoPriceP2pLoading);
	const infoPrice = useSelector(selectPublicInfoPriceP2p);
	const dispatch = useDispatch();

	useEffect(() => {
		if (currencyId && fiatId) {
			dispatch(infoPriceSupportedFetch({ currencyId, fiatId }));
		}
	}, [currencyId, fiatId]);

	return { infoPrice, isLoading };
};
