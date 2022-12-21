import { IPaymentMethod, paymentMethodsFetch, selectPaymentMethods, selectPaymentMethodsLoading } from 'modules';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUsePaymentMethodsFetch {
	listPaymentMethods: IPaymentMethod[];
	isLoading: boolean;
}

export const usePaymentMethodsFetch = (): IUsePaymentMethodsFetch => {
	const dispatch = useDispatch();
	const loading = useSelector(selectPaymentMethodsLoading);
	const listPayments = useSelector(selectPaymentMethods);
	const validCallPrivate = useCallPrivateApi();

	useEffect(() => {
		if (!loading && validCallPrivate) {
			dispatch(paymentMethodsFetch());
		}
	}, [validCallPrivate]);

	return { listPaymentMethods: listPayments.data, isLoading: loading };
};
