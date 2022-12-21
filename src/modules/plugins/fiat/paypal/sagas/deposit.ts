import { API, RequestOptions } from 'api';
import { put, call } from 'redux-saga/effects';
import { getCsrfToken } from 'helpers';
import {
	PaypalDepositCreate,
	paypalDepositData,
	PaypalRecentDepositGet,
	getPaypalDepositHistory,
	recentPaypalDepositData,
} from '../actions/deposit';
import { PaypalRecentDeposit } from '../types';
import { alertPush } from 'modules';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'paypal', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* getRecentDepositSaga(action: PaypalRecentDepositGet) {
	try {
		const recentPaypalDepositResponse: PaypalRecentDeposit = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/paypal/deposit/recent?currency_id=${action.payload.currency_id}`,
		);
		yield put(
			recentPaypalDepositData({
				payload: recentPaypalDepositResponse,
				loading: false,
			}),
		);
		yield put(getPaypalDepositHistory({ currency_id: action.payload.currency_id }));
	} catch (error) {
		yield put(
			recentPaypalDepositData({
				payload: {},
				loading: false,
			}),
		);
	}
}

export function* depositSaga(action: PaypalDepositCreate) {
	try {
		const paypalDepositResponse: PaypalRecentDeposit = yield call(
			API.post(createOptions(getCsrfToken())),
			`/private/paypal/deposit/create`,
			action.payload,
		);

		yield put(getPaypalDepositHistory({ currency_id: action.payload.currency_id }));

		yield put(
			recentPaypalDepositData({
				payload: paypalDepositResponse,
				loading: false,
			}),
		);

		yield put(
			paypalDepositData({
				payload: paypalDepositResponse,
				loading: false,
			}),
		);
	} catch (error) {
		const { message } = error as { message: string[] };
		yield put(alertPush({ message: message, type: 'error' }));
		yield put(
			paypalDepositData({
				payload: {},
				loading: false,
			}),
		);
	}
}
