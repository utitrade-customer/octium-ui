import { CommonError } from 'modules/types';

import {
	BANK_WITHDRAW_HISTORY_LIST_FETCH,
	BANK_WITHDRAW_HISTORY_LIST_DATA,
	BANK_WITHDRAW_HISTORY_LIST_ERROR,
	CREATE_BANK_WITHDRAW,
	CREATE_BANK_WITHDRAW_DATA,
	UPDATE_BANK_WITHDRAW_CREATION,
} from '../constants';

import { BankWithdrawHistoryListState, CreateBankWithdrawState, BankWithdraw } from '../types';

export interface BankWithdrawHistoryListFetch {
	type: typeof BANK_WITHDRAW_HISTORY_LIST_FETCH;
}

export interface BankWithdrawHistoryListData {
	type: typeof BANK_WITHDRAW_HISTORY_LIST_DATA;
	payload: BankWithdrawHistoryListState;
}

export interface BankWithdrawHistoryListError {
	type: typeof BANK_WITHDRAW_HISTORY_LIST_ERROR;
	error: CommonError;
}

export interface CreateBankWithdraw {
	type: typeof CREATE_BANK_WITHDRAW;
	payload: {
		currency_id: string;
		amount: number;
		bank_id: number;
		otp: string;
	};
}

export interface CreateBankWithdrawData {
	type: typeof CREATE_BANK_WITHDRAW_DATA;
	payload: CreateBankWithdrawState;
}

export interface UpdateBankWithdrawCreation {
	type: typeof UPDATE_BANK_WITHDRAW_CREATION;
	payload: BankWithdraw;
}

export type BankWithdrawActions =
	| BankWithdrawHistoryListFetch
	| BankWithdrawHistoryListData
	| BankWithdrawHistoryListError
	| CreateBankWithdraw
	| CreateBankWithdrawData
	| UpdateBankWithdrawCreation;

export const bankWithdrawHistoryListFetch = (): BankWithdrawHistoryListFetch => ({ type: BANK_WITHDRAW_HISTORY_LIST_FETCH });

export const bankWithdrawHistoryListData = (payload: BankWithdrawHistoryListData['payload']): BankWithdrawHistoryListData => ({
	type: BANK_WITHDRAW_HISTORY_LIST_DATA,
	payload,
});

export const bankWithdrawHistoryListFetchError = (
	error: BankWithdrawHistoryListError['error'],
): BankWithdrawHistoryListError => ({
	type: BANK_WITHDRAW_HISTORY_LIST_ERROR,
	error,
});

export const createBankWithdraw = (payload: CreateBankWithdraw['payload']): CreateBankWithdraw => ({
	type: CREATE_BANK_WITHDRAW,
	payload,
});

export const createBankWithdrawData = (payload: CreateBankWithdrawData['payload']): CreateBankWithdrawData => ({
	type: CREATE_BANK_WITHDRAW_DATA,
	payload,
});

export const updateBankWithdrawCreation = (payload: UpdateBankWithdrawCreation['payload']): UpdateBankWithdrawCreation => ({
	type: UPDATE_BANK_WITHDRAW_CREATION,
	payload,
});
