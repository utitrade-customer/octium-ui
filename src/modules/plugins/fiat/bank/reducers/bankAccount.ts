import { BankAccountActions } from '../actions/bankAccountActions';

import {
	BANK_ACCOUNT_LIST_FETCH,
	BANK_ACCOUNT_LIST_DATA,
	BANK_ACCOUNT_LIST_ERROR,
	CREATE_BANK_ACCOUNT_DATA,
	DELETE_BANK_ACCOUNT_DATA,
	UPDATE_BANK_ACCOUNT_CREATION,
	UPDATE_BANK_ACCOUNT_DELETION,
} from '../constants';

import { BankAccount, BankAccountListState, CreateBankAccountState, DeleteBankAccountState } from '../types';

export const initialBankAccountList: BankAccountListState = {
	payload: [],
	loading: false,
};

export const initialCreateBankAccount: CreateBankAccountState = {
	loading: false,
};
export const initialDeleteBankAccount: DeleteBankAccountState = {
	loading: false,
};

export const bankAccountListReducer = (state = initialBankAccountList, action: BankAccountActions) => {
	switch (action.type) {
		case BANK_ACCOUNT_LIST_FETCH:
			return { ...state, loading: true, error: undefined };
		case BANK_ACCOUNT_LIST_DATA:
			const { payload, loading } = action.payload;

			return { ...state, payload, loading, error: undefined };

		case BANK_ACCOUNT_LIST_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		case UPDATE_BANK_ACCOUNT_CREATION:
			const newBankAccount: BankAccount = action.payload;

			return {
				...state,
				payload: [...state.payload, newBankAccount],
				loading,
				error: undefined,
			};
		case UPDATE_BANK_ACCOUNT_DELETION:
			const { account_number } = action.payload;

			return {
				...state,
				payload: [...state.payload.filter(bankAccount => bankAccount.account_number !== account_number)],
				loading,
				error: undefined,
			};
		default:
			return state;
	}
};

export const createBankAccountReducer = (state = initialCreateBankAccount, action: BankAccountActions) => {
	switch (action.type) {
		case CREATE_BANK_ACCOUNT_DATA:
			const { loading } = action.payload;

			return { ...state, loading, error: undefined };
		default:
			return state;
	}
};

export const deleteBankAccountReducer = (state = initialDeleteBankAccount, action: BankAccountActions) => {
	switch (action.type) {
		case DELETE_BANK_ACCOUNT_DATA:
			const { loading } = action.payload;

			return { ...state, loading, error: undefined };
		default:
			return state;
	}
};
