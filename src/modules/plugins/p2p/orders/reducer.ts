import { OrderConfigsActions } from './actions';
import {
	P2P_PRIVATE_CRUD_ORDER_LOADING,
	P2P_PRIVATE_ORDER_DATA,
	P2P_PRIVATE_ORDER_FETCH,
	P2P_PRIVATE_ORDER_FIND_CHANGE,
	P2P_PRIVATE_ORDER_FIND_DATA,
	P2P_PRIVATE_ORDER_FIND_FETCH,
	P2P_PRIVATE_ORDER_CHANGE,
} from './constants';
import { P2pOrdersPrivateState, P2pOrdersPrivateStateFindItemState } from './types';
import produce from 'immer';

export const initialOrdersPrivate: P2pOrdersPrivateState = {
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
	isLoadingCRUD: false,
};

export const p2pOrdersPrivateReducer = (state = initialOrdersPrivate, action: OrderConfigsActions): P2pOrdersPrivateState => {
	switch (action.type) {
		case P2P_PRIVATE_ORDER_FETCH: {
			return {
				...state,
				loading: true,
			};
		}

		case P2P_PRIVATE_ORDER_DATA: {
			const { payload, loading } = action.payload;
			return {
				...state,
				payload,
				loading: loading,
			};
		}

		case P2P_PRIVATE_CRUD_ORDER_LOADING: {
			const { isLoadingCRUD } = action.payload;

			return {
				...state,
				isLoadingCRUD: isLoadingCRUD,
			};
		}

		case P2P_PRIVATE_ORDER_CHANGE: {
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
		default:
			return state;
	}
};

export const initialOrdersPrivateFindItem: P2pOrdersPrivateStateFindItemState = {
	payload: {
		data: undefined,
	},
	loading: false,
	err: false,
};

export const p2pOrdersPrivateFindItemReducer = (
	state = initialOrdersPrivateFindItem,
	action: OrderConfigsActions,
): P2pOrdersPrivateStateFindItemState => {
	switch (action.type) {
		case P2P_PRIVATE_ORDER_FIND_FETCH: {
			return {
				...state,
				loading: true,
			};
		}

		case P2P_PRIVATE_ORDER_FIND_DATA: {
			const { payload, loading } = action.payload;
			return {
				...state,
				payload,
				loading: loading,
			};
		}

		case P2P_PRIVATE_ORDER_FIND_CHANGE: {
			return {
				...state,
				payload: {
					data: action.payload,
				},
			};
		}

		default:
			return state;
	}
};
