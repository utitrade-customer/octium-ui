import { BankWithdrawActions } from '../actions/bankWithdrawActions';
import {
	BANK_WITHDRAW_HISTORY_LIST_FETCH,
	BANK_WITHDRAW_HISTORY_LIST_DATA,
	BANK_WITHDRAW_HISTORY_LIST_ERROR,
	CREATE_BANK_WITHDRAW_DATA,
	UPDATE_BANK_WITHDRAW_CREATION,
} from '../constants';

import { BankWithdrawHistoryListState, CreateBankWithdrawState, BankWithdraw } from '../types';

export const initialBankWithdrawHistoryList: BankWithdrawHistoryListState = {
	payload: [],
	loading: false,
};

export const initialCreateBankWithdraw: CreateBankWithdrawState = {
	loading: false,
};

export const bankWithdrawHistoryListReducer = (state = initialBankWithdrawHistoryList, action: BankWithdrawActions) => {
	switch (action.type) {
		case BANK_WITHDRAW_HISTORY_LIST_FETCH:
			return { ...state, loading: true, error: undefined };
		case BANK_WITHDRAW_HISTORY_LIST_DATA:
			const { payload, loading } = action.payload;

			return { ...state, payload, loading, error: undefined };

		case BANK_WITHDRAW_HISTORY_LIST_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		case UPDATE_BANK_WITHDRAW_CREATION:
			const newBankWithdraw: BankWithdraw = action.payload;

			return {
				...state,
				payload: [newBankWithdraw, ...state.payload],
				loading,
				error: undefined,
			};
		default:
			return state;
	}
};

export const createBankWithdrawReducer = (state = initialCreateBankWithdraw, action: BankWithdrawActions) => {
	switch (action.type) {
		case CREATE_BANK_WITHDRAW_DATA:
			const { loading } = action.payload;

			return { ...state, loading, error: undefined };
		default:
			return state;
	}
};
