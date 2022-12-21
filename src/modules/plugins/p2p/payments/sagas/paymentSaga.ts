import { API } from 'api';
import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from 'helpers';
import {
	PaymentMethodsAdd,
	paymentMethodsData,
	PaymentMethodsEdit,
	PaymentMethodsRemove,
	paymentMethodsUpdateStateAdd,
	paymentMethodsUpdateStateEdit,
	paymentMethodsUpdateStateRemove,
} from '../actions';
import { alertPush } from 'modules/public/alert';
import { createOptionsP2p } from '../../type/utils.common';

export function* paymentMethodsSaga() {
	try {
		const data = yield call(
			API.get(createOptionsP2p(getCsrfToken())),
			`/private/account/payments?isTakeAll=true&sort=updatedAt:DESC`,
		);

		yield put(
			paymentMethodsData({
				payload: data,
				loading: false,
				isLoadingCRUD: false,
			}),
		);
	} catch (error) {
		yield put(
			paymentMethodsData({
				payload: {
					data: [],
					meta: {
						page: 1,
						limit: 0,
						itemCount: 0,
						pageCount: 1,
						hasPreviousPage: false,
						hasNextPage: false,
					},
				},
				loading: false,
				isLoadingCRUD: false,
			}),
		);
	}
}

export function* addPaymentMethodsSaga(action: PaymentMethodsAdd) {
	try {
		const data = yield call(API.post(createOptionsP2p(getCsrfToken())), `/private/account/payments`, action.payload);
		yield put(
			paymentMethodsUpdateStateAdd({
				item: data,
			}),
		);

		yield put(alertPush({ message: ['success.p2p.payment.create'], type: 'success' }));
		action.callback();
	} catch (error) {
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* editPaymentMethodsSaga(action: PaymentMethodsEdit) {
	try {
		const data = yield call(API.put(createOptionsP2p(getCsrfToken())), `/private/account/payments/${action.payload.id}`, {
			fields: action.payload.fields,
		});
		yield put(
			paymentMethodsUpdateStateEdit({
				item: data,
			}),
		);

		yield put(alertPush({ message: ['success.p2p.payment.edit'], type: 'success' }));
		action.callback();
	} catch (error) {
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* removePaymentMethodsSaga(action: PaymentMethodsRemove) {
	try {
		yield call(API.delete(createOptionsP2p(getCsrfToken())), `/private/account/payments/${action.payload.id}`);
		yield put(paymentMethodsUpdateStateRemove({ item: { id: +action.payload.id } }));

		yield put(alertPush({ message: ['success.p2p.payment.delete'], type: 'success' }));
		action.callback();
	} catch (error) {
		yield put(alertPush({ message: error.message, type: 'error' }));
		action.callback();
	}
}
