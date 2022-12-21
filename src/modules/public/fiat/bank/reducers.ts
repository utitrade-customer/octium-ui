import { BankActions } from './actions';

import { BANK_LIST_FETCH, BANK_LIST_DATA, BANK_LIST_ERROR } from './constants';

import { BankListState } from './types';

export const initialBankList: BankListState = {
	payload: [],
	loading: false,
};

export const bankListReducer = (state = initialBankList, action: BankActions) => {
	switch (action.type) {
		case BANK_LIST_FETCH:
			return { ...state, loading: true, error: undefined };
		case BANK_LIST_DATA:
			const { payload, loading } = action.payload;

			return { ...state, payload, loading, error: undefined };

		case BANK_LIST_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
