import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers/getCsrfToken';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { bankWithdrawHistoryListFetch, CreateBankWithdraw, createBankWithdrawData } from '../actions/bankWithdrawActions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* createBankWithdrawSaga(action: CreateBankWithdraw) {
	try {
		yield put(
			createBankWithdrawData({
				loading: true,
			}),
		);
		const { otp } = action.payload;

		yield call(API.post(createOptions(getCsrfToken())), `/private/bank/withdraw?otp=${otp}`, action.payload);

		yield put(bankWithdrawHistoryListFetch());

		yield put(alertPush({ message: ['Create Bank Withdraw Successfully'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		createBankWithdrawData({
			loading: false,
		}),
	);
}
