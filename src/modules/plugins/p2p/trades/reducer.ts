import produce from 'immer';
import { P2pTradesActions } from './actions';
import {
	INFO_TRADE_ITEM_DATA,
	INFO_TRADE_ITEM_FETCH,
	INFO_TRADE_RESET_ERROR,
	OPEN_TRADES_DATA,
	OPEN_TRADES_FETCH,
} from './constants';
import { P2pInfoOrderTradeState, P2pInfoTradesState } from './types';

export const initialInfoTrades: P2pInfoTradesState = {
	loading: false,
};

export const p2pInfoTradesReducer = (state = initialInfoTrades, action: P2pTradesActions): P2pInfoTradesState => {
	switch (action.type) {
		case OPEN_TRADES_FETCH:
			return {
				...state,
				loading: true,
			};

		case INFO_TRADE_ITEM_FETCH:
			return {
				...state,
				loading: true,
			};

		case INFO_TRADE_ITEM_DATA:
			const nextState = produce(state, draft => {
				const { payload, error } = action.payload;

				draft.data = payload;
				draft.loading = false;

				draft.error = error;
			});
			return nextState;

		case OPEN_TRADES_DATA:
			const nextStateOpenTrade = produce(state, draft => {
				const { payload, error } = action.payload;
				draft.data = payload;
				draft.loading = false;
				draft.error = error;
			});
			return nextStateOpenTrade;

		case INFO_TRADE_RESET_ERROR: {
			const nextStateResetError = produce(state, draft => {
				draft.error = undefined;
			});
			return nextStateResetError;
		}

		default:
			return state;
	}
};

export const initialInfoOrderTrades: P2pInfoOrderTradeState = {
	data: {},
	loading: false,
};
