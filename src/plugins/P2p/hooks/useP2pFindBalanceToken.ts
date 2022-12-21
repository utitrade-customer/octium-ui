import {
	IBalance,
	p2pFindBalanceFetch,
	selectP2pFindBalanceToken,
	selectP2pFindBalanceTokenLoading,
} from 'modules/plugins/p2p/balances';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2Balances {
	balance?: IBalance;
	error: boolean;
	isLoading: boolean;
}

export const useP2PFindBalanceToken = (name: string): IUseP2Balances => {
	const dispatch = useDispatch();
	const validCallPrivate = useCallPrivateApi('low');

	const isLoading = useSelector(selectP2pFindBalanceTokenLoading);
	const token = useSelector(selectP2pFindBalanceToken);

	useEffect(() => {
		validCallPrivate &&
			name &&
			dispatch(
				p2pFindBalanceFetch({
					name,
				}),
			);
	}, [name, validCallPrivate]);

	return { balance: token.token, error: token.error, isLoading };
};
