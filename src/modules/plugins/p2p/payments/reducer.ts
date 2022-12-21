import { PaymentMethodsActions } from './actions';
import {
	PAYMENT_METHODS_DATA,
	PAYMENT_METHODS_FETCH,
	PAYMENT_METHODS_UPDATE_STATE_ADD,
	PAYMENT_METHODS_UPDATE_STATE_EDIT,
	PAYMENT_METHODS_UPDATE_STATE_REMOVE,
	PAYMENT_METHODS_CRUD_LOADING,
} from './constants';
import { IPaymentMethod, PaymentMethodsState } from './types';
import produce from 'immer';

export const initialPaymentMethods: PaymentMethodsState = {
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

export const paymentMethodsReducer = (state = initialPaymentMethods, action: PaymentMethodsActions): PaymentMethodsState => {
	switch (action.type) {
		case PAYMENT_METHODS_FETCH:
			return {
				...state,
				loading: true,
			};
		case PAYMENT_METHODS_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
			};

		case PAYMENT_METHODS_UPDATE_STATE_ADD:
			const nextStateAdd = produce(state, draft => {
				draft.payload.data.unshift(action.payload.item);
			});
			return nextStateAdd;

		case PAYMENT_METHODS_UPDATE_STATE_EDIT:
			const nextStateEdit = produce(state, draft => {
				draft.payload.data =
					draft.payload.data.map(e => {
						if (e.id === action.payload.item.id) {
							return action.payload.item as IPaymentMethod;
						}
						return e;
					}) || [];
			});
			return nextStateEdit;

		case PAYMENT_METHODS_UPDATE_STATE_REMOVE:
			const nextStateRemove = produce(state, draft => {
				draft.payload.data = draft.payload.data.filter(e => e.id !== action.payload.item.id);
			});
			return nextStateRemove;

		case PAYMENT_METHODS_CRUD_LOADING: {
			return {
				...state,
				isLoadingCRUD: action.payload,
			};
		}

		default:
			return state;
	}
};
