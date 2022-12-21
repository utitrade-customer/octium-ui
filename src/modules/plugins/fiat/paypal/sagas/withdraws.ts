import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from 'helpers';
import {
	PaypalWithdrawCreate,
	paypalWithdrawHistoryData,
	PaypalWithdrawHistoryGet,
	getPaypalWithdrawHistory,
} from '../actions/withdraw';
import { PaypalWithdrawHistory } from '../types';
import { alertPush } from 'modules';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'paypal', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* createPaypalWithdraw(action: PaypalWithdrawCreate) {
	try {
		const { currency_id, amount, otp, email } = action.payload;
		if (!currency_id) {
			yield put(alertPush({ message: ['Missing Currency ID'], type: 'error' }));
		}
		if (!amount) {
			yield put(alertPush({ message: ['Missing Withdrawal Amount'], type: 'error' }));
		}
		if (!otp) {
			yield put(alertPush({ message: ['Missing OTP code'], type: 'error' }));
		}
		if (!email) {
			yield put(alertPush({ message: ['Missing Email'], type: 'error' }));
		}
		yield call(
			API.post(createOptions(getCsrfToken())),
			`/private/paypal/withdraw/create?otp=${action.payload.otp}`,
			action.payload,
		);
		yield put(alertPush({ message: ['Withdraw successfully'], type: 'success' }));
		yield put(getPaypalWithdrawHistory({ currency_id: currency_id }));
	} catch (error) {
		const { message } = error as { message: string[] };
		yield put(alertPush({ message: message, type: 'error' }));
	}
}

export function* getWithdrawHistory(action: PaypalWithdrawHistoryGet) {
	try {
		const recentPaypalDepositResponse: PaypalWithdrawHistory[] = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/paypal/withdraw/history?currency_id=${action.payload.currency_id}`,
		);
		yield put(
			paypalWithdrawHistoryData({
				payload: recentPaypalDepositResponse,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			paypalWithdrawHistoryData({
				payload: [],
				loading: false,
			}),
		);
	}
}
