import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { CreateP2PReport, createP2PReportData } from '../actions';

const createOptions = (apiVersion: RequestOptions['apiVersion'], csrfToken?: string): RequestOptions => {
	return { apiVersion: apiVersion, headers: { 'X-CSRF-Token': csrfToken } };
};

export function* createReportSaga(action: CreateP2PReport) {
	try {
		const { userID } = action.payload;
		yield put(
			createP2PReportData({
				loading: true,
			}),
		);

		// data is array of image urls
		const response: {
			data: string[];
			message: string;
		} = yield call(API.post(createOptions('picture', getCsrfToken())), `/private/create`, {
			images: action.payload.images,
		});

		yield call(API.post(createOptions('p2p', getCsrfToken())), `/private/advertisements/reports/${userID}`, {
			...action.payload,
			images: response.data,
		});

		yield put(alertPush({ message: ['Create Report Successfully'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		createP2PReportData({
			loading: false,
		}),
	);
}
