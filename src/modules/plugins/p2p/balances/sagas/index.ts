import { takeLatest } from 'redux-saga/effects';
import {
	BALANCES_FETCH,
	HISTORY_BALANCES_FETCH,
	FIND_BALANCES_FETCH,
	VALUE_BALANCES_FETCH,
	P2P_TRANSFERS_TOKEN,
} from '../constants';
import {
	p2pBalancesSaga,
	p2pFindBalanceTokenSaga,
	p2pHistoryBalancesSaga,
	p2pTransferTokenSaga,
	p2pValueBalancesSaga,
} from './balancesSaga';

export function* rootP2PBalancesSaga() {
	yield takeLatest(BALANCES_FETCH, p2pBalancesSaga);
	yield takeLatest(HISTORY_BALANCES_FETCH, p2pHistoryBalancesSaga);
	yield takeLatest(P2P_TRANSFERS_TOKEN, p2pTransferTokenSaga);
	yield takeLatest(VALUE_BALANCES_FETCH, p2pValueBalancesSaga);
	yield takeLatest(FIND_BALANCES_FETCH, p2pFindBalanceTokenSaga);
}
