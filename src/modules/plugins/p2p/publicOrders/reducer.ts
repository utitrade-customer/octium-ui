import { OrderPublicOrdersActions } from './actions';
import {
	PUBLIC_ORDER_CHANGE,
	PUBLIC_ORDER_DATA,
	PUBLIC_ORDER_FETCH,
	PUBLIC_ORDER_ITEM_DATA,
	PUBLIC_ORDER_ITEM_FETCH,
	PUBLIC_ORDER_RESET_ERROR,
} from './constants';
import { P2pPublicOrdersState } from './types';
import produce from 'immer';

export const initialPublicOrder: P2pPublicOrdersState = {
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

export const p2pPublicOrderReducer = (state = initialPublicOrder, action: OrderPublicOrdersActions): P2pPublicOrdersState => {
	switch (action.type) {
		case PUBLIC_ORDER_FETCH:
			return {
				...state,
				loading: true,
			};
		case PUBLIC_ORDER_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
			};

		case PUBLIC_ORDER_ITEM_FETCH:
			return {
				...state,
				loading: true,
			};
		case PUBLIC_ORDER_ITEM_DATA:
			const nextState = produce(state, draft => {
				const { item, error } = action.payload;

				if (item) {
					draft.payload.data.push(item);
				}
				draft.loading = false;

				error && (draft.error = error);
			});

			return nextState;

		case PUBLIC_ORDER_CHANGE: {
			const nextStateEdit = produce(state, draft => {
				draft.payload.data =
					draft.payload.data.map(item => {
						if (item.id === action.payload.id) {
							return action.payload;
						}
						return item;
					}) || [];
			});
			return nextStateEdit;
		}

		case PUBLIC_ORDER_RESET_ERROR: {
			const nextStateResetError = produce(state, draft => {
				draft.error = undefined;
			});
			return nextStateResetError;
		}
		default:
			return state;
	}
};
