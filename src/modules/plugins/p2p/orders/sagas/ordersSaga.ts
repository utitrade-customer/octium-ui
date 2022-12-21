import { API } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { createOptionsP2p } from '../../type/utils.common';
import {
	P2pPrivateOrdersAdd,
	P2pPrivateOrdersClosed,
	p2pPrivateOrdersCRUDLoading,
	p2pPrivateOrdersData,
	P2PPrivateOrdersFetch,
	p2pPrivateOrdersFindItemData,
	P2PPrivateOrdersFindItemFetch,
	P2pPrivateOrdersUpdate,
} from '../actions';

export function* p2pPrivateOrderFetch(action: P2PPrivateOrdersFetch) {
	try {
		const { payload } = action;
		const searchParams = new URLSearchParams();
		Object.keys(payload).forEach(key => payload[key] && searchParams.append(key, payload[key]));

		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `/private/advertisements/orders?${searchParams}`);

		yield put(p2pPrivateOrdersData({ payload: data, loading: false }));
	} catch (error) {
		yield put(
			p2pPrivateOrdersData({
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

export function* p2pPrivateOrderFindItemFetch(action: P2PPrivateOrdersFindItemFetch) {
	try {
		const { id } = action.payload;
		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `/private/advertisements/orders/${id}`);

		yield put(
			p2pPrivateOrdersFindItemData({
				payload: {
					data,
				},
				loading: false,
				err: false,
			}),
		);
	} catch (error) {
		yield put(p2pPrivateOrdersFindItemData({ payload: { data: undefined }, loading: false, err: false }));
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pPrivateOrderAddSaga(action: P2pPrivateOrdersAdd) {
	try {
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: true }));
		yield call(API.post(createOptionsP2p(getCsrfToken())), `/private/advertisements/orders`, {
			...action.payload,
		});
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: false }));
		yield put(alertPush({ message: ['success.p2p.order.create'], type: 'success' }));
		action.callback('/p2p/list');
	} catch (error) {
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: false }));
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pPrivateOrderUpdateSaga(action: P2pPrivateOrdersUpdate) {
	try {
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: true }));
		const { id, valueUpdate } = action.payload;
		yield call(API.put(createOptionsP2p(getCsrfToken())), `/private/advertisements/orders/${id}`, {
			...valueUpdate,
		});
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: false }));
		yield put(alertPush({ message: ['success.p2p.order.update'], type: 'success' }));
		action.callback('/p2p/list');
	} catch (error) {
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: false }));
		yield put(alertPush({ message: error.message, type: 'error' }));
		// action.callback('/p2p');
	}
}

export function* p2pPrivateOrderClosedSaga(action: P2pPrivateOrdersClosed) {
	try {
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: true }));
		yield call(API.delete(createOptionsP2p(getCsrfToken())), `/private/advertisements/orders/${action.payload.id}`);
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: false }));
		yield put(alertPush({ message: ['success.p2p.order.closed'], type: 'success' }));
	} catch (error) {
		console.log('error', error);
		yield put(p2pPrivateOrdersCRUDLoading({ isLoadingCRUD: false }));
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}
