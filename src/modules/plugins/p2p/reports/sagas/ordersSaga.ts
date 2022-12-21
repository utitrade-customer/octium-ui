import { API } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { createOptionsP2p } from '../../type/utils.common';
import { p2PReportsFetchData } from '../actions';

export function* p2pReportsFetch() {
	try {
		const data = yield call(API.get(createOptionsP2p(getCsrfToken())), `/private/advertisements/changeme`);

		yield put(p2PReportsFetchData({ payload: data }));
	} catch (error) {
		yield put(
			p2PReportsFetchData({
				error,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}
