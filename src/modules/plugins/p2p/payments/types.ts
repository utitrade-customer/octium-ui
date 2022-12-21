import { CommonState } from 'modules/types';
import { IPayload } from '../type/interface.common';

export interface PaymentMethodFields {
	name: string;
	value: string;
}

export interface IPaymentMethod {
	id: number;
	paymentConfig: number;
	fields: PaymentMethodFields[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IPaymentMethodAdd {
	paymentConfig: number;
	fields: PaymentMethodFields[];
}

export interface IPaymentMethodEdit {
	id: number;
	fields: PaymentMethodFields[];
}

export interface IPaymentMethodRemove {
	id: number;
}

export interface PaymentMethodsState extends CommonState {
	payload: IPayload<IPaymentMethod[]>;
	loading: boolean;
	isLoadingCRUD: boolean;
}

export interface IPaymentMethodsUpdateStateAdd {
	item: IPaymentMethod;
}
export interface IPaymentMethodsUpdateStateEdit {
	item: Partial<IPaymentMethod>;
}

export interface IPaymentMethodsUpdateStateRemove {
	item: IPaymentMethodRemove;
}
