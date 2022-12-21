import {
	BANK_DEPOSIT_HISTORY_LIST_FETCH,
	BANK_WITHDRAW_HISTORY_LIST_FETCH,
	CREATE_BANK_DEPOSIT,
	CREATE_BANK_WITHDRAW,
} from './../constants';
import { takeLatest } from 'redux-saga/effects';
import { BANK_ACCOUNT_LIST_FETCH, CREATE_BANK_ACCOUNT, DELETE_BANK_ACCOUNT } from '../constants';
import { fetchBankAccountListSaga } from './bankAccountList';
import { createBankAccountSaga } from './createBankAccount';
import { deleteBankAccountSaga } from './deleteBankAccount';
import { fetchBankDepositHistoryListSaga } from './bankDepositList';
import { createBankDepositSaga } from './createBankDeposit';
import { fetchBankWithdrawHistoryListSaga } from './bankWithdrawList';
import { createBankWithdrawSaga } from './createBankWithdraw';

export function* rootBankSaga() {
	yield takeLatest(BANK_ACCOUNT_LIST_FETCH, fetchBankAccountListSaga);
	yield takeLatest(CREATE_BANK_ACCOUNT, createBankAccountSaga);
	yield takeLatest(DELETE_BANK_ACCOUNT, deleteBankAccountSaga);
	yield takeLatest(BANK_DEPOSIT_HISTORY_LIST_FETCH, fetchBankDepositHistoryListSaga);
	yield takeLatest(CREATE_BANK_DEPOSIT, createBankDepositSaga);
	yield takeLatest(BANK_WITHDRAW_HISTORY_LIST_FETCH, fetchBankWithdrawHistoryListSaga);
	yield takeLatest(CREATE_BANK_WITHDRAW, createBankWithdrawSaga);
}
