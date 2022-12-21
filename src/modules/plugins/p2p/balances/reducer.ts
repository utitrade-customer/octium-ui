import produce from 'immer';
import { P2pBalancesActions } from './actions';
import {
	BALANCES_CHANGED,
	BALANCES_DATA,
	BALANCES_FETCH,
	FIND_BALANCES_CHANGED,
	FIND_BALANCES_DATA,
	FIND_BALANCES_FETCH,
	HISTORY_BALANCES_DATA,
	HISTORY_BALANCES_FETCH,
	VALUE_BALANCES_CHANGED,
	VALUE_BALANCES_DATA,
	VALUE_BALANCES_FETCH,
} from './constants';
import { BalancesState, FindBalanceTokenState, HistoryBalancesState } from './types';

export const initialBalances: BalancesState = {
	payload: {
		data: [],
		meta: {
			page: 1,
			limit: 0,
			itemCount: 0,
			pageCount: 1,
			hasPreviousPage: false,
			hasNextPage: false,
		},
	},
	loading: false,
};

export const p2pBalancesReducer = (state = initialBalances, action: P2pBalancesActions): BalancesState => {
	switch (action.type) {
		case BALANCES_FETCH:
			return {
				...state,
				loading: true,
			};
		case BALANCES_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
			};

		case BALANCES_CHANGED:
			const { balance, locked, currency } = action.payload;

			return produce(state, draft => {
				if (draft.payload.data.length > 0) {
					draft.payload.data = draft.payload.data.map(e => {
						if (e.currency === currency && balance) {
							e.balance = balance;
							e.locked = locked;
						}
						return e;
					});
				} else {
					draft.payload.data = [
						{
							currency: currency,
							balance: balance,
							locked: locked,
						},
					];
				}
			});

		default:
			return state;
	}
};

// ---------------------------------------

export const initialValueBalances: BalancesState = {
	payload: {
		data: [],
		meta: {
			page: 1,
			limit: 0,
			itemCount: 0,
			pageCount: 1,
			hasPreviousPage: false,
			hasNextPage: false,
		},
	},
	loading: false,
};

export const p2pValueBalancesReducer = (state = initialValueBalances, action: P2pBalancesActions): BalancesState => {
	switch (action.type) {
		case VALUE_BALANCES_FETCH:
			return {
				...state,
				loading: true,
			};
		case VALUE_BALANCES_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
			};

		case VALUE_BALANCES_CHANGED:
			const { balance, locked, currency } = action.payload;

			return produce(state, draft => {
				if (draft.payload.data.length > 0) {
					draft.payload.data = draft.payload.data.map(e => {
						if (e.currency === currency && balance) {
							e.balance = balance;
							e.locked = locked;
						}
						return e;
					});
				} else {
					draft.payload.data = [
						{
							currency: currency,
							balance: balance,
							locked: locked,
						},
					];
				}
			});

		default:
			return state;
	}
};

export const initialFindBalance: FindBalanceTokenState = {
	payload: {
		error: false,
		token: undefined,
	},
	loading: false,
};

export const p2pFindBalanceTokenReducer = (state = initialFindBalance, action: P2pBalancesActions): FindBalanceTokenState => {
	switch (action.type) {
		case FIND_BALANCES_FETCH:
			return {
				...state,
				loading: true,
			};
		case FIND_BALANCES_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
			};

		case FIND_BALANCES_CHANGED:
			return {
				...state,
				payload: {
					...state.payload,
					token: action.payload,
				},
			};

		default:
			return state;
	}
};

export const initialHistoryBalances: HistoryBalancesState = {
	payload: {
		data: [],
		meta: {
			page: 1,
			limit: 0,
			itemCount: 0,
			pageCount: 1,
			hasPreviousPage: false,
			hasNextPage: false,
		},
	},
	loading: false,
};

export const p2pHistoryBalancesReducer = (state = initialHistoryBalances, action: P2pBalancesActions): HistoryBalancesState => {
	switch (action.type) {
		case HISTORY_BALANCES_FETCH:
			return {
				...state,
				loading: true,
			};
		case HISTORY_BALANCES_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
			};

		default:
			return state;
	}
};
