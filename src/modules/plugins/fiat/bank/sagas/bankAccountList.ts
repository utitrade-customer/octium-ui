import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { call, put } from 'redux-saga/effects';
import { bankAccountListData, BankAccountListFetch, bankAccountListFetchError } from '../actions/bankAccountActions';
import { BankAccount } from '../types';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

interface BankAccountListResponse {
	data: {
		list: BankAccount[];
		total: number;
	};
	message: string;
}

export function* fetchBankAccountListSaga(action: BankAccountListFetch) {
	try {
		const list: BankAccountListResponse = yield call(API.get(createOptions(getCsrfToken())), '/private/bank/list');

		yield put(bankAccountListData({ payload: list.data.list, loading: false }));
	} catch (error) {
		yield put(
			bankAccountListData({
				payload: [],
				loading: false,
			}),
		);
		yield put(bankAccountListFetchError(error));
	}
}
