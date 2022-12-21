import { takeLatest } from 'redux-saga/effects';
import { P2P_FEEDBACK_FETCH } from '../constants';
import { p2pFeedbacksFetch } from './ordersSaga';

export function* rootP2PFeedbacksSaga() {
	yield takeLatest(P2P_FEEDBACK_FETCH, p2pFeedbacksFetch);
}
