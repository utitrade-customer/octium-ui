import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';
import { bankDepositHistoryListFetch, CreateBankDeposit, createBankDepositData } from '../actions/bankDepositActions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

// interface CreateBankDepositResponse {
// 	status: string;
// 	message: string;
// 	data: BankDeposit;
// }

export function* createBankDepositSaga(action: CreateBankDeposit) {
	try {
		yield put(
			createBankDepositData({
				loading: true,
			}),
		);
		yield call(API.post(createOptions(getCsrfToken())), `/private/bank/deposit`, action.payload);

		yield put(bankDepositHistoryListFetch());

		yield put(alertPush({ message: ['Create Bank Deposit Successfully'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		createBankDepositData({
			loading: false,
		}),
	);
}
