import { CommonError } from 'modules/types';

import {
	BANK_DEPOSIT_HISTORY_LIST_FETCH,
	BANK_DEPOSIT_HISTORY_LIST_DATA,
	BANK_DEPOSIT_HISTORY_LIST_ERROR,
	CREATE_BANK_DEPOSIT,
	CREATE_BANK_DEPOSIT_DATA,
	UPDATE_BANK_DEPOSIT_CREATION,
} from '../constants';

import { BankDepositHistoryListState, CreateBankDepositState, BankDeposit } from '../types';

export interface BankDepositHistoryListFetch {
	type: typeof BANK_DEPOSIT_HISTORY_LIST_FETCH;
}

export interface BankDepositHistoryListData {
	type: typeof BANK_DEPOSIT_HISTORY_LIST_DATA;
	payload: BankDepositHistoryListState;
}

export interface BankDepositHistoryListError {
	type: typeof BANK_DEPOSIT_HISTORY_LIST_ERROR;
	error: CommonError;
}

export interface CreateBankDeposit {
	type: typeof CREATE_BANK_DEPOSIT;
	payload: {
		currency_id: string;
		amount: number;
		txid: string;
	};
}

export interface CreateBankDepositData {
	type: typeof CREATE_BANK_DEPOSIT_DATA;
	payload: CreateBankDepositState;
}

export interface UpdateBankDepositCreation {
	type: typeof UPDATE_BANK_DEPOSIT_CREATION;
	payload: BankDeposit & {
		isSuccess?: boolean;
	};
}

export type BankDepositActions =
	| BankDepositHistoryListFetch
	| BankDepositHistoryListData
	| BankDepositHistoryListError
	| CreateBankDeposit
	| CreateBankDepositData
	| UpdateBankDepositCreation;

export const bankDepositHistoryListFetch = (): BankDepositHistoryListFetch => ({ type: BANK_DEPOSIT_HISTORY_LIST_FETCH });

export const bankDepositHistoryListData = (payload: BankDepositHistoryListData['payload']): BankDepositHistoryListData => ({
	type: BANK_DEPOSIT_HISTORY_LIST_DATA,
	payload,
});

export const bankDepositHistoryListFetchError = (error: BankDepositHistoryListError['error']): BankDepositHistoryListError => ({
	type: BANK_DEPOSIT_HISTORY_LIST_ERROR,
	error,
});

export const createBankDeposit = (payload: CreateBankDeposit['payload']): CreateBankDeposit => ({
	type: CREATE_BANK_DEPOSIT,
	payload,
});

export const createBankDepositData = (payload: CreateBankDepositData['payload']): CreateBankDepositData => ({
	type: CREATE_BANK_DEPOSIT_DATA,
	payload,
});

export const updateBankDepositCreation = (payload: UpdateBankDepositCreation['payload']): UpdateBankDepositCreation => ({
	type: UPDATE_BANK_DEPOSIT_CREATION,
	payload,
});
