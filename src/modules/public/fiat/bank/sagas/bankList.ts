import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { call, put } from 'redux-saga/effects';
import { bankListData, BankListFetch, bankListFetchError } from '../actions';
import { Bank } from '../types';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

interface BankListResponse {
	data: {
		list: Bank[];
		total: number;
	};
	message: string;
}

export function* fetchBankListSaga(action: BankListFetch) {
	try {
		const list: BankListResponse = yield call(API.get(createOptions(getCsrfToken())), '/public/bank/india/list');

		yield put(bankListData({ payload: list.data.list, loading: false }));
	} catch (error) {
		yield put(
			bankListData({
				payload: [],
				loading: false,
			}),
		);
		yield put(bankListFetchError(error));
	}
}
