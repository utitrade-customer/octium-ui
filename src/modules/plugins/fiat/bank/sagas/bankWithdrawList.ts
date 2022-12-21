import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers/getCsrfToken';
import { call, put } from 'redux-saga/effects';
import {
	bankWithdrawHistoryListData,
	BankWithdrawHistoryListFetch,
	bankWithdrawHistoryListFetchError,
} from '../actions/bankWithdrawActions';
import { BankWithdraw } from '../types';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

interface BankWithdrawHistoryListResponse {
	data: {
		list: BankWithdraw[];
		total: number;
	};
	message: string;
}

export function* fetchBankWithdrawHistoryListSaga(action: BankWithdrawHistoryListFetch) {
	try {
		const list: BankWithdrawHistoryListResponse = yield call(
			API.get(createOptions(getCsrfToken())),
			'/private/bank/withdraw/history',
		);

		yield put(bankWithdrawHistoryListData({ payload: list.data.list, loading: false }));
	} catch (error) {
		yield put(
			bankWithdrawHistoryListData({
				payload: [],
				loading: false,
			}),
		);
		yield put(bankWithdrawHistoryListFetchError(error));
	}
}
