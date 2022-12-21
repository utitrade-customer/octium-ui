import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { infoPriceSupportedData, InfoPriceSupportedFetch, infoSupportedData } from '../actions';
const createOptions = (csrfToken?: string): RequestOptions => {
	return {
		apiVersion: 'p2p',
		headers: { 'X-CSRF-Token': csrfToken },
	};
};
export function* p2pInfoSupportedSaga() {
	try {
		const data = yield call(API.get(createOptions(getCsrfToken())), `/public/info`);

		yield put(
			infoSupportedData({
				payload: data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			infoSupportedData({
				payload: {
					fiatSupported: [],
					currencySupported: [],
					paymentSupported: [],
					minutesTimePerTran: 0,
				},
				loading: false,
			}),
		);

		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pPriceSupportedSaga(action: InfoPriceSupportedFetch) {
	try {
		const { currencyId, fiatId } = action.payload;
		const data = yield call(
			API.get(createOptions(getCsrfToken())),
			`/public/info/price?currencyId=${currencyId}&fiatId=${fiatId}`,
		);

		yield put(
			infoPriceSupportedData({
				payload: data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			infoPriceSupportedData({
				payload: {
					higher: 0,
					lower: 0,
				},
				loading: false,
			}),
		);

		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}
