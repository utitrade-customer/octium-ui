import { BankDepositActions } from '../actions/bankDepositActions';
import {
	BANK_DEPOSIT_HISTORY_LIST_FETCH,
	BANK_DEPOSIT_HISTORY_LIST_DATA,
	BANK_DEPOSIT_HISTORY_LIST_ERROR,
	CREATE_BANK_DEPOSIT_DATA,
	UPDATE_BANK_DEPOSIT_CREATION,
} from '../constants';

import { BankDepositHistoryListState, CreateBankDepositState, BankDeposit } from '../types';

export const initialBankDepositHistoryList: BankDepositHistoryListState = {
	payload: [],
	loading: true,
};

export const initialCreateBankDeposit: CreateBankDepositState = {
	loading: false,
};

export const bankDepositHistoryListReducer = (state = initialBankDepositHistoryList, action: BankDepositActions) => {
	switch (action.type) {
		case BANK_DEPOSIT_HISTORY_LIST_FETCH:
			return { ...state, loading: true, error: undefined };
		case BANK_DEPOSIT_HISTORY_LIST_DATA:
			const { payload, loading } = action.payload;

			return { ...state, payload, loading, error: undefined };

		case BANK_DEPOSIT_HISTORY_LIST_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		case UPDATE_BANK_DEPOSIT_CREATION:
			const newBankDeposit: BankDeposit = action.payload;
			return {
				...state,
				payload: [newBankDeposit, ...state.payload],
				loading: false,
				error: undefined,
			};
		default:
			return state;
	}
};

export const createBankDepositReducer = (state = initialCreateBankDeposit, action: BankDepositActions) => {
	switch (action.type) {
		case CREATE_BANK_DEPOSIT_DATA:
			const { loading } = action.payload;
			return { ...state, loading, error: undefined };
		default:
			return state;
	}
};
