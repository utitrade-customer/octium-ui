import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { call, put } from 'redux-saga/effects';
import {
	bankDepositHistoryListData,
	BankDepositHistoryListFetch,
	bankDepositHistoryListFetchError,
} from '../actions/bankDepositActions';
import { BankDeposit } from '../types';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

interface BankDepositHistoryListResponse {
	data: {
		list: BankDeposit[];
		total: number;
	};
	message: string;
}

export function* fetchBankDepositHistoryListSaga(action: BankDepositHistoryListFetch) {
	try {
		const list: BankDepositHistoryListResponse = yield call(
			API.get(createOptions(getCsrfToken())),
			'/private/bank/deposit/history',
		);

		yield put(bankDepositHistoryListData({ payload: list.data.list, loading: false }));
	} catch (error) {
		yield put(
			bankDepositHistoryListData({
				payload: [],
				loading: false,
			}),
		);
		yield put(bankDepositHistoryListFetchError(error));
	}
}
