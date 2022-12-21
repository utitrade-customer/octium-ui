import { API, RequestOptions } from 'api';
import { put, call } from 'redux-saga/effects';
import { getCsrfToken } from 'helpers';
import { PaypalDepositHistory, paypalDepositHistoryData, PaypalDepositHistoryGet } from '..';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'paypal', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* getDepositHistorySaga(action: PaypalDepositHistoryGet) {
	try {
		const recentPaypalDepositResponse: PaypalDepositHistory[] = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/paypal/deposit/history?currency_id=${action.payload.currency_id}`,
		);
		yield put(
			paypalDepositHistoryData({
				payload: recentPaypalDepositResponse,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			paypalDepositHistoryData({
				payload: [],
				loading: false,
			}),
		);
	}
}
