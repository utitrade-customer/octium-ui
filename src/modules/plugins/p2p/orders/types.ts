import { CommonState } from 'modules/types';
import { IPaymentMethod } from '../payments';
import { IPublicOrderFetchParams } from '../publicOrders';
import { IPayload } from '../type/interface.common';
export interface IP2PPrivateOrder {
	id: number;
	currency: string;
	fiat: string;
	type: 'buy' | 'sell';
	status: 'trading' | 'canceled';
	price: number;
	volume: number;
	originVolume: number;
	orderMin: number;
	orderMax: number;
	minutesTimeLimit: number;
	remarks?: string;
	autoReplyContent?: string;
	requireRegistered?: number;
	minHoldBtc: number;
	payments: IPaymentMethod[];
	createdAt: Date;
	updatedAt: Date;
}
export interface IP2PPrivateOrderAdd {
	currency: string;
	fiat: string;
	type: 'buy' | 'sell';
	price: number;
	volume: number;
	orderMin: number;
	orderMax: number;
	payments: number[];
	minutesTimeLimit: number;
	remarks?: string;
	autoReplyContent?: string;
	requireRegistered?: number;
	minHoldBtc: number;
	otp: string;
}

export interface IP2PPrivateOrderUpdate {
	id: number;
	valueUpdate: {
		price: number;
		orderMin: number;
		orderMax: number;
		payments: number[];
		minutesTimeLimit: number;
		remarks?: string;
		autoReplyContent?: string;
		requireRegistered?: number;
		minHoldBtc: number;
		otp: string;
	};
}

export interface IP2PPrivateOrderClosed {
	id: number;
}

export interface IsP2pOrdersCRUDLoading {
	isLoadingCRUD: boolean;
}

export interface IP2PPrivateOrdersData {
	payload: IPayload<IP2PPrivateOrder[]>;
	loading: boolean;
}
export interface P2pOrdersPrivateState extends CommonState {
	payload: IPayload<IP2PPrivateOrder[]>;
	loading: boolean;
	isLoadingCRUD: boolean;
}

export interface P2pOrdersPrivateStateFindItemState extends CommonState {
	payload: {
		data?: IP2PPrivateOrder;
	};
	loading: boolean;
	err: boolean;
}

export type IPrivateOrderStatus = 'blocked' | 'canceled' | 'trading' | 'completed';
export interface IPrivateOrderFetchParams extends Partial<IPublicOrderFetchParams> {
	status?: IPrivateOrderStatus;
	startAt?: string;
	endAt?: string;
}
