import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { call, put } from 'redux-saga/effects';

import { eventData, EventFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'announcement', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* eventFetchSaga(action: EventFetch) {
	try {
		const events = yield call(API.get(createOptions(getCsrfToken())), '/public/banner/list');
		yield put(
			eventData({
				payload: events,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			eventData({
				payload: [],
				loading: false,
			}),
		);
		console.log(`Error call get banner api ${JSON.stringify(error)}`);
	}
}
