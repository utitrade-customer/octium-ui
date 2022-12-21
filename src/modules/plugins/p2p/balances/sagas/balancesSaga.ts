import { API } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { createOptionsP2p } from '../../type/utils.common';
import {
	BalancesFetch,
	FindBalancesFetch,
	HistoryBalancesFetch,
	p2pBalancesData,
	p2pFindBalanceData,
	p2pHistoryBalancesData,
	p2pValueBalancesData,
	TransferToken,
} from '../actions';
import { IDataBalance } from '../types';

export function* p2pBalancesSaga(action: BalancesFetch) {
	try {
		let paramOptions = '';

		const { payload } = action;

		if (payload) {
			for (const key in payload) {
				if (key === 'order') {
					paramOptions += `sort=balance:${payload[key]}&`;
				} else {
					paramOptions += `${key}=${payload[key]}&`;
				}
			}
		}

		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `/private/account/balances?${paramOptions}`);

		yield put(
			p2pBalancesData({
				payload: data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			p2pBalancesData({
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

export function* p2pValueBalancesSaga() {
	try {
		const data: IDataBalance = yield call(
			API.get(createOptionsP2p(getCsrfToken())),
			`/private/account/balances?order=DESC&isTakeAll=true`,
		);

		yield put(
			p2pValueBalancesData({
				payload: data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			p2pBalancesData({
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

export function* p2pFindBalanceTokenSaga(action: FindBalancesFetch) {
	try {
		const { name } = action.payload;
		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `private/account/balances/${name}`);
		yield put(
			p2pFindBalanceData({
				payload: {
					error: false,
					token: data,
				},
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			p2pFindBalanceData({
				payload: {
					error: true,
					token: undefined,
				},
				loading: false,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pTransferTokenSaga(action: TransferToken) {
	try {
		yield call(API.post(createOptionsP2p(getCsrfToken())), `private/account/transfer`, action.payload);
		yield put(alertPush({ message: ['success.p2p.balance.transfer_to_funding'], type: 'success' }));
		action.callback();
	} catch (error) {
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pHistoryBalancesSaga(action: HistoryBalancesFetch) {
	try {
		const { payload } = action;

		const searchParams = new URLSearchParams();
		Object.keys(payload).forEach(key => payload[key] && searchParams.append(key, payload[key]));

		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `private/account/liabilities?${searchParams}`);
		yield put(
			p2pHistoryBalancesData({
				payload: data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(alertPush({ message: error.message, type: 'error' }));
		yield put(
			p2pHistoryBalancesData({
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
	}
}
