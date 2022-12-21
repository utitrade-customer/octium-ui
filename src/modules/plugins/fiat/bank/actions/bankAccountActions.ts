import { CommonError } from 'modules/types';
import {
	BANK_ACCOUNT_LIST_FETCH,
	BANK_ACCOUNT_LIST_DATA,
	BANK_ACCOUNT_LIST_ERROR,
	CREATE_BANK_ACCOUNT,
	CREATE_BANK_ACCOUNT_DATA,
	DELETE_BANK_ACCOUNT,
	DELETE_BANK_ACCOUNT_DATA,
	UPDATE_BANK_ACCOUNT_CREATION,
	UPDATE_BANK_ACCOUNT_DELETION,
} from '../constants';

import { BankAccount, BankAccountListState, CreateBankAccountState, DeleteBankAccountState } from '../types';

export interface BankAccountListFetch {
	type: typeof BANK_ACCOUNT_LIST_FETCH;
}

export interface BankAccountListData {
	type: typeof BANK_ACCOUNT_LIST_DATA;
	payload: BankAccountListState;
}

export interface BankAccountListError {
	type: typeof BANK_ACCOUNT_LIST_ERROR;
	error: CommonError;
}

export interface CreateBankAccount {
	type: typeof CREATE_BANK_ACCOUNT;
	payload: {
		ifsc_code: string;
		bank_name: string;
		bank_address: string;
		account_name: string;
		account_number: string;
		otp: string;
	};
}
export interface UpdateBankAccountCreation {
	type: typeof UPDATE_BANK_ACCOUNT_CREATION;
	payload: BankAccount;
}

export interface CreateBankAccountData {
	type: typeof CREATE_BANK_ACCOUNT_DATA;
	payload: CreateBankAccountState;
}

export interface DeleteBankAccount {
	type: typeof DELETE_BANK_ACCOUNT;
	payload: {
		account_number: string;
		otp: string;
	};
}
export interface UpdateBankAccountDeletion {
	type: typeof UPDATE_BANK_ACCOUNT_DELETION;
	payload: {
		account_number: string;
	};
}

export interface DeleteBankAccountData {
	type: typeof DELETE_BANK_ACCOUNT_DATA;
	payload: DeleteBankAccountState;
}

export type BankAccountActions =
	| BankAccountListFetch
	| BankAccountListData
	| BankAccountListError
	| CreateBankAccount
	| CreateBankAccountData
	| DeleteBankAccount
	| DeleteBankAccountData
	| UpdateBankAccountCreation
	| UpdateBankAccountDeletion;

export const bankAccountListFetch = (): BankAccountListFetch => ({ type: BANK_ACCOUNT_LIST_FETCH });

export const bankAccountListData = (payload: BankAccountListData['payload']): BankAccountListData => ({
	type: BANK_ACCOUNT_LIST_DATA,
	payload,
});

export const bankAccountListFetchError = (error: BankAccountListError['error']): BankAccountListError => ({
	type: BANK_ACCOUNT_LIST_ERROR,
	error,
});

export const createBankAccount = (payload: CreateBankAccount['payload']): CreateBankAccount => ({
	type: CREATE_BANK_ACCOUNT,
	payload,
});

export const createBankAccountData = (payload: CreateBankAccountData['payload']): CreateBankAccountData => ({
	type: CREATE_BANK_ACCOUNT_DATA,
	payload,
});

export const updateBankAccountCreation = (payload: UpdateBankAccountCreation['payload']): UpdateBankAccountCreation => ({
	type: UPDATE_BANK_ACCOUNT_CREATION,
	payload,
});

export const deleteBankAccount = (payload: DeleteBankAccount['payload']): DeleteBankAccount => ({
	type: DELETE_BANK_ACCOUNT,
	payload,
});

export const deleteBankAccountData = (payload: DeleteBankAccountData['payload']): DeleteBankAccountData => ({
	type: DELETE_BANK_ACCOUNT_DATA,
	payload,
});
export const updateBankAccountDeletion = (payload: UpdateBankAccountDeletion['payload']): UpdateBankAccountDeletion => ({
	type: UPDATE_BANK_ACCOUNT_DELETION,
	payload,
});
