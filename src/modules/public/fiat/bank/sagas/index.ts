import { takeLatest } from 'redux-saga/effects';
import { BANK_LIST_FETCH } from '../constants';
import { fetchBankListSaga } from './bankList';

export function* rootPublicBankListSaga() {
	yield takeLatest(BANK_LIST_FETCH, fetchBankListSaga);
}
