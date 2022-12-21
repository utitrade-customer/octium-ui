import { API } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { createOptionsP2p } from '../../type/utils.common';
import { p2pPrivateTradeItemData, p2pPrivateTradesData, PrivateTradesFetch } from '../actions';

export function* p2pPrivateTradesSaga(action: PrivateTradesFetch) {
	try {
		const { payload } = action;
		const searchParams = new URLSearchParams();
		Object.keys(payload).forEach(key => payload[key] && searchParams.append(key, payload[key]));

		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `/private/advertisements/trades?${searchParams}`);

		yield put(
			p2pPrivateTradesData({
				payload: data,
			}),
		);
	} catch (error) {
		yield put(
			p2pPrivateTradesData({
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
				error,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pPrivateTradeItemSaga() {
	try {
		const payload = {
			isTakeAll: true,
			sort: 'updatedAt:DESC',
			state: 'pending',
		};

		const searchParams = new URLSearchParams();
		Object.keys(payload).forEach(key => payload[key] && searchParams.append(key, payload[key]));
		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `/private/advertisements/trades?${searchParams}`);

		yield put(
			p2pPrivateTradeItemData({
				payload: data.data,
			}),
		);
	} catch (error) {
		yield put(
			p2pPrivateTradeItemData({
				payload: [],
				error,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}
