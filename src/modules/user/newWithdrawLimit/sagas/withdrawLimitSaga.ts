// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { WithdrawLimitChecking, withdrawLimitCheckingResponse, WithdrawLimitFetchRemains, withdrawLimitRemainsData } from '..';
import { API, RequestOptions } from 'api';
import { WithdrawLimitFeeFetch, fetchWithdrawLimitFeeData, fetchWithdrawLimitFeeError } from '../actions';
import { alertPush } from '../../../public/alert';
import { getCsrfToken } from 'helpers';
import _toNumber from 'lodash/toNumber';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'withdrawLimit', headers: { 'X-CSRF-Token': csrfToken } };
};
export interface IwithdrawLimitDefault {
	id: number;
	level: number;
	limit: string | number;
}
export const withdrawLimitDefault: IwithdrawLimitDefault = {
	id: 0,
	level: 0,
	limit: '0.00',
};

export function* withdrawLimitRemainsSaga(action: WithdrawLimitFetchRemains) {
	try {
		const { remains, limit } = yield call(API.get(createOptions(getCsrfToken())), `/private/withdrawLimit/remains`);
		yield put(
			withdrawLimitRemainsData({
				remains: _toNumber(remains),
				limit: _toNumber(limit),
			}),
		);
		// yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
	} catch (error) {
		yield put(
			withdrawLimitRemainsData({
				remains: 0,
				limit: 0,
			}),
		);
		yield put(alertPush({ message: [], code: error.code, type: 'error' }));
	}
}

export function* withdrawLimitCheckingSaga(action: WithdrawLimitChecking) {
	try {
		const {
			isEnough,
			message,
		}: {
			isEnough: boolean;
			message: string;
		} = yield call(API.post(createOptions(getCsrfToken())), `/private/withdrawLimit/checking`, action.payload);
		yield put(
			withdrawLimitCheckingResponse({
				isEnough: isEnough,
				message: message,
			}),
		);
		// yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
	} catch (error) {
		yield put(
			withdrawLimitCheckingResponse({
				isEnough: false,
				message: 'network is down',
			}),
		);
		yield put(alertPush({ message: [], code: error.code, type: 'error' }));
	}
}

export function* withdrawLimitFeeSaga(action: WithdrawLimitFeeFetch) {
	try {
		const { data } = yield call(API.get(createOptions(getCsrfToken())), `/public/withdrawLimit/limit`);
		yield put(fetchWithdrawLimitFeeData(data));
	} catch (err) {
		yield put(fetchWithdrawLimitFeeError({ withdrawLimitDefault }));
	}
}
