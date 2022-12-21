import { CommonError, CommonState } from 'modules/types';
import { IPaymentMethod } from '../payments';
import { Owner } from '../publicOrders';
import { TStatusTrade } from '../trades';
import { IPayload } from '../type/interface.common';

export interface IP2pPrivateTrade {
	id: number;
	memberId: number;
	order: number;
	currency: string;
	fiat: string;
	type: 'buy' | 'sell';
	payment: IPaymentMethod;
	price: number;
	amount: number;
	total: number;
	status: TStatusTrade;
	numPaid: string;
	owner: Owner;
	partner: Owner;
	createdAt: Date;
	updatedAt: Date;
}

export interface IP2pPrivateTradesState extends CommonState {
	data: IPayload<IP2pPrivateTrade[]>;
	loading: boolean;
}

export interface IP2pPrivateTradeItemNewState extends CommonState {
	data: IP2pPrivateTrade[];
	loading: boolean;
}
// payload
export interface IP2pPayloadPrivateTrades {
	payload: IPayload<IP2pPrivateTrade[]>;
	error?: CommonError;
}

export interface IP2pPayloadPrivateItemTrade {
	payload: IP2pPrivateTrade[];
	error?: CommonError;
}

export interface IP2pPayloadPrivateNewItemTrade {
	payload: IP2pPrivateTrade;
}

// params
export type TPrivateTradesState = 'pending' | 'completed';

export type TPrivateTradesStatus = TStatusTrade;

export interface IP2pParamsPrivateTradesFetch {
	type?: 'buy' | 'sell';
	currency?: string;
	sort?: string;
	page?: number;
	limit?: number;
	state?: TPrivateTradesState;
	status?: TPrivateTradesStatus;
	startAt?: string;
	endAt?: string;
}
