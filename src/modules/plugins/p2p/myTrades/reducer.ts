import produce from 'immer';
import { PrivateTradeActions } from './actions';
import {
	PRIVATE_MY_TRADE_DATA,
	PRIVATE_MY_TRADE_FETCH,
	PRIVATE_MY_TRADE_ITEM_DATA,
	PRIVATE_MY_TRADE_ITEM_FETCH,
	PRIVATE_MY_TRADE_NEW_ITEM_DATA,
} from './constants';
import { IP2pPrivateTradesState, IP2pPrivateTradeItemNewState } from './types';

export const initialPrivateTrades: IP2pPrivateTradesState = {
	data: {
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

export const p2pPrivateTradesReducer = (state = initialPrivateTrades, action: PrivateTradeActions): IP2pPrivateTradesState => {
	switch (action.type) {
		case PRIVATE_MY_TRADE_FETCH:
			return {
				...state,
				loading: true,
			};
		case PRIVATE_MY_TRADE_DATA:
			const { payload, error } = action.payload;

			return {
				...state,
				data: payload,
				loading: false,
				error: error,
			};

		default:
			return state;
	}
};

export const initialPrivateTradeItemNew: IP2pPrivateTradeItemNewState = {
	data: [],
	loading: false,
};

export const p2pPrivateTradeItemNewReducer = (
	state = initialPrivateTradeItemNew,
	action: PrivateTradeActions,
): IP2pPrivateTradeItemNewState => {
	switch (action.type) {
		case PRIVATE_MY_TRADE_ITEM_FETCH:
			return {
				...state,
				loading: true,
			};
		case PRIVATE_MY_TRADE_ITEM_DATA:
			const { payload, error } = action.payload;

			return {
				...state,
				data: payload,
				error,
				loading: false,
			};

		case PRIVATE_MY_TRADE_NEW_ITEM_DATA: {
			const nextState = produce(state, draft => {
				if (draft.data.length > 0) {
					const findIndexExited = draft.data.findIndex(item => item.id === action.payload.payload.id);
					if (findIndexExited > -1) {
						draft.data[findIndexExited] = action.payload.payload;
					} else {
						draft.data.unshift(action.payload.payload);
					}
				} else {
					draft.data.unshift(action.payload.payload);
				}
			});

			return nextState;
		}

		default:
			return state;
	}
};
