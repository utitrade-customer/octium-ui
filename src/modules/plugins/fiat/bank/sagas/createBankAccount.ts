import { /* bankAccountListFetch, */ updateBankAccountCreation } from 'modules/plugins/fiat/bank/actions/bankAccountActions';
import { CreateBankAccount, createBankAccountData } from '../actions/bankAccountActions';
import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';
import { alertPush } from 'modules/public/alert';
import { BankAccount } from '../types';
import { getCsrfToken } from 'helpers';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

interface CreateBankAccountResponse {
	status: string;
	message: string;
	data: BankAccount;
}

export function* createBankAccountSaga(action: CreateBankAccount) {
	try {
		yield put(
			createBankAccountData({
				loading: true,
			}),
		);
		const { otp } = action.payload;
		const result: CreateBankAccountResponse = yield call(
			API.post(createOptions(getCsrfToken())),
			`/private/bank/create?otp=${otp}`,
			action.payload,
		);

		// yield put(bankAccountListFetch());
		yield put(updateBankAccountCreation({ ...result.data }));

		yield put(alertPush({ message: ['Create Bank Account Successfully'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		createBankAccountData({
			loading: false,
		}),
	);
}
