import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { p2pPrivateInfoUserData, p2pPublicInfoUserData, PrivateInfoUserEditNameFetch, PublicInfoUserFetch } from '../actions';
const createOptions = (csrfToken?: string): RequestOptions => {
	return {
		apiVersion: 'p2p',
		headers: { 'X-CSRF-Token': csrfToken },
	};
};

export function* p2pPrivateInfoUserSaga() {
	try {
		const data = yield call(API.get(createOptions(getCsrfToken())), `/private/account`);

		yield put(
			p2pPrivateInfoUserData({
				loading: false,
				payload: data,
			}),
		);
	} catch (error) {
		yield put(
			p2pPrivateInfoUserData({
				loading: false,
				error,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}

export function* p2pPrivateInfoUserEditNameSaga(action: PrivateInfoUserEditNameFetch) {
	try {
		const { payload, callBack } = action;
		const data = yield call(API.put(createOptions(getCsrfToken())), `/private/account`, {
			fullName: payload.fullName,
		});

		yield put(
			p2pPrivateInfoUserData({
				loading: false,
				payload: data,
			}),
		);
		callBack && callBack();
	} catch (error) {
		const { callBack } = action;
		yield put(
			p2pPrivateInfoUserData({
				loading: false,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));

		callBack && callBack();
	}
}

export function* p2pPublicInfoUserSaga(action: PublicInfoUserFetch) {
	try {
		const { id } = action.payload;

		const data = yield call(API.get(createOptions()), `/public/account/${id}`);

		yield put(
			p2pPublicInfoUserData({
				loading: false,
				payload: data,
			}),
		);
	} catch (error) {
		yield put(
			p2pPublicInfoUserData({
				loading: false,
				error,
			}),
		);
		yield put(alertPush({ message: error.message, type: 'error' }));
	}
}
