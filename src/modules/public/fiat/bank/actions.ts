import { CommonError } from 'modules/types';
import { BANK_LIST_FETCH, BANK_LIST_DATA, BANK_LIST_ERROR } from './constants';

import { BankListState } from './types';

export interface BankListFetch {
	type: typeof BANK_LIST_FETCH;
}

export interface BankListData {
	type: typeof BANK_LIST_DATA;
	payload: BankListState;
}

export interface BankListError {
	type: typeof BANK_LIST_ERROR;
	error: CommonError;
}

export type BankActions = BankListFetch | BankListData | BankListError;

export const bankListFetch = (): BankListFetch => ({ type: BANK_LIST_FETCH });

export const bankListData = (payload: BankListData['payload']): BankListData => ({
	type: BANK_LIST_DATA,
	payload,
});

export const bankListFetchError = (error: BankListError['error']): BankListError => ({
	type: BANK_LIST_ERROR,
	error,
});
