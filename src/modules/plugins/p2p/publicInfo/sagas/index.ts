import { takeLatest } from 'redux-saga/effects';
import { INFO_SUPPORTED_FETCH, PRICE_SUPPORTED_FETCH } from '../constants';
import { p2pInfoSupportedSaga, p2pPriceSupportedSaga } from './publicInfosSaga';

export function* rootP2PPublicInfosSaga() {
	yield takeLatest(INFO_SUPPORTED_FETCH, p2pInfoSupportedSaga);
	yield takeLatest(PRICE_SUPPORTED_FETCH, p2pPriceSupportedSaga);
}
