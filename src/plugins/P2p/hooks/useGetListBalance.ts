import {
	p2pBalancesFetch,
	selectP2pBalances,
	IOptionQuery,
	selectP2pBalancesLoading,
	IDataBalance,
} from 'modules/plugins/p2p/balances';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2Balances {
	p2pBalances: IDataBalance;
	isLoading: boolean;
}
const DEFAULT_LIMIT = 10;

export const useP2PBalances = (param: IOptionQuery): IUseP2Balances => {
	const dispatch = useDispatch();
	const validCallPrivate = useCallPrivateApi('low');

	const loading = useSelector(selectP2pBalancesLoading);
	const listBalanceTmp = useSelector(selectP2pBalances);

	useEffect(() => {
		if (!loading && validCallPrivate) {
			dispatch(
				p2pBalancesFetch({
					...param,
					limit: DEFAULT_LIMIT,
					order: 'DESC',
				}),
			);
		}
	}, [param.page, param.limit, param.order, validCallPrivate]);

	useEffect(() => {
		if (!loading && validCallPrivate) {
			dispatch(
				p2pBalancesFetch({
					...param,
					page: 1,
					order: 'DESC',
					limit: DEFAULT_LIMIT,
				}),
			);
		}
	}, [param.hidden, validCallPrivate]);

	return { p2pBalances: listBalanceTmp, isLoading: loading };
};
