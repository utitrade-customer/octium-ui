import {
	PAYMENT_METHODS_ADD,
	PAYMENT_METHODS_CRUD_LOADING,
	PAYMENT_METHODS_DATA,
	PAYMENT_METHODS_EDIT,
	PAYMENT_METHODS_FETCH,
	PAYMENT_METHODS_REMOVE,
	PAYMENT_METHODS_UPDATE_STATE_ADD,
	PAYMENT_METHODS_UPDATE_STATE_EDIT,
	PAYMENT_METHODS_UPDATE_STATE_REMOVE,
} from './constants';
import {
	PaymentMethodsState,
	IPaymentMethodAdd,
	IPaymentMethodRemove,
	IPaymentMethodEdit,
	IPaymentMethodsUpdateStateAdd,
	IPaymentMethodsUpdateStateEdit,
	IPaymentMethodsUpdateStateRemove,
} from './types';

export interface PaymentMethodsFetch {
	type: typeof PAYMENT_METHODS_FETCH;
}

export interface PaymentMethodsData {
	type: typeof PAYMENT_METHODS_DATA;
	payload: PaymentMethodsState;
}

export interface PaymentMethodsAdd {
	type: typeof PAYMENT_METHODS_ADD;
	payload: IPaymentMethodAdd;
	callback: () => void;
}
export interface PaymentMethodsEdit {
	type: typeof PAYMENT_METHODS_EDIT;
	payload: IPaymentMethodEdit;
	callback: () => void;
}
export interface PaymentMethodsRemove {
	type: typeof PAYMENT_METHODS_REMOVE;
	payload: IPaymentMethodRemove;
	callback: () => void;
}

export interface PaymentMethodsUpdateStateAdd {
	type: typeof PAYMENT_METHODS_UPDATE_STATE_ADD;
	payload: IPaymentMethodsUpdateStateAdd;
}

export interface PaymentMethodsUpdateStateEdit {
	type: typeof PAYMENT_METHODS_UPDATE_STATE_EDIT;
	payload: IPaymentMethodsUpdateStateEdit;
}
export interface PaymentMethodsUpdateStateRemove {
	type: typeof PAYMENT_METHODS_UPDATE_STATE_REMOVE;
	payload: IPaymentMethodsUpdateStateRemove;
}

export interface PaymentMethodsCRUDLoading {
	type: typeof PAYMENT_METHODS_CRUD_LOADING;
	payload: boolean;
}

export type PaymentMethodsActions =
	| PaymentMethodsCRUDLoading
	| PaymentMethodsFetch
	| PaymentMethodsData
	| PaymentMethodsAdd
	| PaymentMethodsEdit
	| PaymentMethodsRemove
	| PaymentMethodsUpdateStateAdd
	| PaymentMethodsUpdateStateEdit
	| PaymentMethodsUpdateStateRemove;

export const paymentMethodsFetch = (): PaymentMethodsFetch => ({
	type: PAYMENT_METHODS_FETCH,
});

export const paymentMethodsData = (payload: PaymentMethodsState): PaymentMethodsData => ({
	type: PAYMENT_METHODS_DATA,
	payload,
});

export const paymentMethodsAdd = (payload: IPaymentMethodAdd, callback: () => void): PaymentMethodsAdd => ({
	type: PAYMENT_METHODS_ADD,
	payload,
	callback,
});

export const paymentMethodsEdit = (payload: IPaymentMethodEdit, callback: () => void): PaymentMethodsEdit => ({
	type: PAYMENT_METHODS_EDIT,
	payload,
	callback,
});

export const paymentMethodsRemove = (payload: IPaymentMethodRemove, callback: () => void): PaymentMethodsRemove => ({
	type: PAYMENT_METHODS_REMOVE,
	payload,
	callback,
});

export const paymentMethodsUpdateStateAdd = (payload: IPaymentMethodsUpdateStateAdd): PaymentMethodsUpdateStateAdd => ({
	type: PAYMENT_METHODS_UPDATE_STATE_ADD,
	payload,
});

export const paymentMethodsUpdateStateEdit = (payload: IPaymentMethodsUpdateStateEdit): PaymentMethodsUpdateStateEdit => ({
	type: PAYMENT_METHODS_UPDATE_STATE_EDIT,
	payload,
});

export const paymentMethodsUpdateStateRemove = (payload: IPaymentMethodsUpdateStateRemove): PaymentMethodsUpdateStateRemove => ({
	type: PAYMENT_METHODS_UPDATE_STATE_REMOVE,
	payload,
});

export const paymentMethodsCRUDLoading = (payload: boolean): PaymentMethodsCRUDLoading => ({
	type: PAYMENT_METHODS_CRUD_LOADING,
	payload,
});
