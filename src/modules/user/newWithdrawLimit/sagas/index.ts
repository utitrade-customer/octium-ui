import { takeLatest } from 'redux-saga/effects';
import { WITHDRAW_LIMIT_FETCH_REMAINS, WITHDRAW_LIMIT_CHECKING, WITHDRAW_LIMIT_FEE_FETCH } from '../constants';
import { withdrawLimitCheckingSaga, withdrawLimitRemainsSaga, withdrawLimitFeeSaga } from './withdrawLimitSaga';

export function* rootNewWithdrawLimitSaga() {
	yield takeLatest(WITHDRAW_LIMIT_CHECKING, withdrawLimitCheckingSaga);
	yield takeLatest(WITHDRAW_LIMIT_FETCH_REMAINS, withdrawLimitRemainsSaga);
	yield takeLatest(WITHDRAW_LIMIT_FEE_FETCH, withdrawLimitFeeSaga);
}
