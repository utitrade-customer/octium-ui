import {
	DeleteBankAccount,
	deleteBankAccountData,
	updateBankAccountDeletion,
} from 'modules/plugins/fiat/bank/actions/bankAccountActions';
import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';
import { alertPush } from 'modules/public/alert';
import { getCsrfToken } from 'helpers';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'bank', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* deleteBankAccountSaga(action: DeleteBankAccount) {
	try {
		yield put(
			deleteBankAccountData({
				loading: true,
			}),
		);
		const { otp, account_number } = action.payload;

		yield call(API.delete(createOptions(getCsrfToken())), `/private/bank/delete?otp=${otp}`, { account_number });

		yield put(updateBankAccountDeletion({ account_number }));
		yield put(alertPush({ message: ['Delete Bank Account Successfully'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		deleteBankAccountData({
			loading: false,
		}),
	);
}
