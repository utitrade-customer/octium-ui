import { takeLatest } from 'redux-saga/effects';
import {
	PAYPAL_DEPOSIT_CREATE,
	PAYPAL_DEPOSIT_HISTORY_GET,
	PAYPAL_DEPOSIT_RECENT_GET,
	PAYPAL_WITHDRAW_CREATE,
	PAYPAL_WITHDRAW_HISTORY_GET,
} from '../constants';

import { depositSaga, getRecentDepositSaga } from './deposit';
import { getDepositHistorySaga } from './history';
import { createPaypalWithdraw, getWithdrawHistory } from './withdraws';

export function* rootPaypalSaga() {
	yield takeLatest(PAYPAL_DEPOSIT_CREATE, depositSaga);
	yield takeLatest(PAYPAL_DEPOSIT_RECENT_GET, getRecentDepositSaga);
	yield takeLatest(PAYPAL_DEPOSIT_HISTORY_GET, getDepositHistorySaga);
	yield takeLatest(PAYPAL_WITHDRAW_CREATE, createPaypalWithdraw);
	yield takeLatest(PAYPAL_WITHDRAW_HISTORY_GET, getWithdrawHistory);
}
