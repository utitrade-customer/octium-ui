import { API } from 'api';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { createOptionsP2p } from '../../type/utils.common';
import { p2pPublicOrderData, p2pPublicOrderItemData, PublicOrderFetch, PublicOrderItemFetch } from '../actions';

export function* p2pPublicOrderSaga(action: PublicOrderFetch) {
	try {
		const { payload } = action;
		const searchParams = new URLSearchParams();
		Object.keys(payload).forEach(key => payload[key] && searchParams.append(key, payload[key]));

		const data = yield call(API.get(createOptionsP2p()), `/public/advertisements/orders?${searchParams}`);

		yield put(
			p2pPublicOrderData({
				payload: data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			p2pPublicOrderData({
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
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pPublicOrderItemSaga(action: PublicOrderItemFetch) {
	try {
		const { id } = action.payload;
		const data = yield call(API.get(createOptionsP2p()), `/public/advertisements/orders/${id}`);

		yield put(
			p2pPublicOrderItemData({
				item: data,
			}),
		);
	} catch (error) {
		yield put(
			p2pPublicOrderItemData({
				item: undefined,
				error: {
					message: error.message,
					code: error.code,
				},
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}
