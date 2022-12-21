import { CommonError, CommonState } from 'modules/types';
import { IP2pPrivateTrade } from '../myTrades';
import { IItemPublicOrder } from '../publicOrders';

export interface IP2pOpenTrade {
	openOrder: {
		id: number;
		price: number;
		amount: number;
		payment?: number;
		otp: string;
	};
	callback: (tradeId: number) => void;
	errCallback: () => void;
}

export interface IP2pCancelTrade {
	id: number;
}

export type TStatusTrade = 'unpaid' | 'paid' | 'appeal pending' | 'completed' | 'canceled';

export const indexOfStatusTrade: Record<string, number> = {
	unpaid: 0,
	paid: 1,
	'appeal pending': 2,
	completed: 3,
	canceled: 4,
};

export type IP2pTypeMessage = 'text' | 'image' | 'ping-admin';

export interface IP2pTradeMessage {
	id: string;
	tradeId: number;
	userId: string;
	role: 'admin' | 'member';
	content: string;
	type: IP2pTypeMessage;
	createdAt: string;
	updatedAt: string;
}

export interface IP2pTradeInfoMessages {
	trade: number;
	data: IP2pTradeMessage[];
}

export interface P2pInfoTradesState extends CommonState {
	data?: IP2pPrivateTrade;
	loading: boolean;
}

export interface P2pInfoOrderTradeState extends CommonState {
	data: Record<number, IItemPublicOrder>;
	loading: boolean;
}

export interface IP2pTradesPayload extends CommonState {
	payload?: IP2pPrivateTrade;
	loading: boolean;
	error?: CommonError;
}

export interface IP2pSendMessage {
	trade: number;
	type: IP2pTypeMessage;
	content: string;
}

export interface IP2pUpdateTradeNextStepForPaid {
	id: number;
	payment?: number; //For unpaid
	otp?: string;
}
