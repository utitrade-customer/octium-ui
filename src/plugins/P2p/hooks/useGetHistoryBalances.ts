import _ from 'lodash';
import {
	IHistoryBalance,
	IHistoryBalanceQuery,
	p2pHistoryBalancesFetch,
	selectP2pHistoryBalances,
	selectP2pHistoryBalancesLoading,
} from 'modules/plugins/p2p/balances';
import { IPayload } from 'modules/plugins/p2p/type/interface.common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseP2HistoryBalances {
	historyBalances: IPayload<IHistoryBalance[]>;
	isLoading: boolean;
}

export const useP2PHistoryBalances = (queryHistory: IHistoryBalanceQuery): IUseP2HistoryBalances => {
	const { endedAt, limit, page, sort, startedAt, type } = queryHistory;
	const validCallPrivate = useCallPrivateApi('low');
	const dispatch = useDispatch();

	const loading = useSelector(selectP2pHistoryBalancesLoading);
	const listHistoryBalancesTmp = useSelector(selectP2pHistoryBalances);

	useEffect(() => {
		if (!loading && validCallPrivate) {
			dispatch(p2pHistoryBalancesFetch(_.omitBy({ ...queryHistory }, _.isNil)));
		}
	}, [validCallPrivate, endedAt, limit, page, sort, startedAt, type]);

	return { historyBalances: listHistoryBalancesTmp, isLoading: loading };
};
