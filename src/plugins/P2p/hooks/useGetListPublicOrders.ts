import {
	IItemPublicOrder,
	IPublicOrderFetchParams,
	p2pPublicOrderFetch,
	selectOrderPublic,
	selectOrderPublicLoading,
} from 'modules';
import { IPayload } from 'modules/plugins/p2p/type/interface.common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IUseGetListPublicOrders {
	ordersPublic: IPayload<IItemPublicOrder[]>;
	isLoading: boolean;
}

interface IUseGetListPublicOrdersProps extends IPublicOrderFetchParams {
	timeReload?: number;
}
// const maxNumber = Number.MAX_VALUE;

let autoReload;

const defaultLimitItem = 10;

enum DefaultSort {
	ASC = 'ASC',
	DESC = 'DESC',
}

export const useGetListPublicOrders = (props: IUseGetListPublicOrdersProps): IUseGetListPublicOrders => {
	const { timeReload, currency, fiat, page, orderMin, payment, type } = props;
	const dispatch = useDispatch();

	const isLoading = useSelector(selectOrderPublicLoading);
	const ordersPublic = useSelector(selectOrderPublic);

	useEffect(() => {
		if (currency && fiat) {
			dispatch(
				p2pPublicOrderFetch({
					fiat: fiat.toLocaleLowerCase(),
					currency: currency.toLocaleLowerCase(),
					page,
					limit: defaultLimitItem,
					orderMin,
					payment,
					type,
					sort: `price:${type === 'sell' ? DefaultSort.ASC : DefaultSort.DESC}`,
				}),
			);
		}
	}, [currency, fiat, page, orderMin, payment, type]);

	useEffect(() => {
		if (timeReload && currency && fiat) {
			clearInterval(autoReload);
			autoReload = setInterval(() => {
				dispatch(
					p2pPublicOrderFetch({
						fiat: fiat.toLocaleLowerCase(),
						currency: currency.toLocaleLowerCase(),
						page,
						orderMin,
						limit: defaultLimitItem,
						payment,
						type,
						sort: `price:${type === 'sell' ? DefaultSort.ASC : DefaultSort.DESC}`,
					}),
				);
			}, timeReload * 1000);
		} else {
			clearInterval(autoReload);
		}

		return () => {
			clearInterval(autoReload);
		};
	}, [timeReload, currency, fiat, page, orderMin, payment, type]);

	return { ordersPublic, isLoading };
};
