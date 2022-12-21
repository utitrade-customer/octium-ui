import { API } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { IP2pPrivateTrade } from '../../myTrades';
import { createOptionsP2p } from '../../type/utils.common';
import {
	P2pCancelTradesFetch,
	p2pGetInfoTradeData,
	P2pGetInfoTradeFetch,
	p2pOpenTradesData,
	P2pOpenTradesFetch,
} from '../actions';

export function* p2pOpenTradeSaga(action: P2pOpenTradesFetch) {
	try {
		const { payload } = action;
		const { callback } = payload;
		const { id, price, amount, payment, otp } = payload.openOrder;

		const data: IP2pPrivateTrade = yield call(
			API.post(createOptionsP2p(getCsrfToken())),
			`/private/advertisements/trades/${id}`,
			{
				price,
				amount,
				payment,
				otp,
			},
		);

		yield put(
			p2pOpenTradesData({
				payload: data,
				loading: false,
			}),
		);
		callback && callback(data.id);
	} catch (error) {
		const { payload } = action;
		const { errCallback } = payload;

		yield put(
			p2pOpenTradesData({
				loading: false,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));

		errCallback && errCallback();
	}
}

export function* p2pCancelTradeSaga(action: P2pCancelTradesFetch) {
	try {
		const { payload } = action;
		const { id } = payload;

		yield call(API.delete(createOptionsP2p(getCsrfToken())), `/private/advertisements/trades/${id}`);
	} catch (error) {
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pInfoTradeSaga(action: P2pGetInfoTradeFetch) {
	try {
		const { id } = action.payload;
		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `/private/advertisements/trades/${id}`);

		yield put(
			p2pGetInfoTradeData({
				payload: data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(p2pGetInfoTradeData({ loading: false, error }));

		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}
