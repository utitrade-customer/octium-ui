import { takeLatest } from 'redux-saga/effects';
import { P2P_CREATE_REPORT, P2P_REPORT_FETCH } from '../constants';
import { createReportSaga } from './createP2PReport';
import { p2pReportsFetch } from './ordersSaga';

export function* rootP2PReportsSaga() {
	yield takeLatest(P2P_REPORT_FETCH, p2pReportsFetch);
	yield takeLatest(P2P_CREATE_REPORT, createReportSaga);
}
