import {
	CANCEL_TRADES_FETCH,
	INFO_TRADE_ITEM_DATA,
	INFO_TRADE_ITEM_FETCH,
	INFO_TRADE_RESET_ERROR,
	OPEN_TRADES_DATA,
	OPEN_TRADES_FETCH,
} from './constants';
import { IP2pCancelTrade, IP2pOpenTrade, IP2pTradesPayload } from './types';

export interface P2pCancelTradesFetch {
	type: typeof CANCEL_TRADES_FETCH;
	payload: IP2pCancelTrade;
}

export interface P2pOpenTradesFetch {
	type: typeof OPEN_TRADES_FETCH;
	payload: IP2pOpenTrade;
}

export interface P2pOpenTradesData {
	type: typeof OPEN_TRADES_DATA;
	payload: IP2pTradesPayload;
}

export interface P2pGetInfoTradeFetch {
	type: typeof INFO_TRADE_ITEM_FETCH;
	payload: {
		id: number;
	};
}

export interface P2pGetInfoTradeData {
	type: typeof INFO_TRADE_ITEM_DATA;
	payload: IP2pTradesPayload;
}

export interface P2pInfoTradeResetError {
	type: typeof INFO_TRADE_RESET_ERROR;
}

export type P2pTradesActions =
	| P2pGetInfoTradeFetch
	| P2pGetInfoTradeData
	| P2pOpenTradesFetch
	| P2pOpenTradesData
	| P2pInfoTradeResetError
	| P2pCancelTradesFetch;

export const p2pCancelTradesFetch = (payload: IP2pCancelTrade): P2pCancelTradesFetch => ({
	type: CANCEL_TRADES_FETCH,
	payload,
});

export const p2pOpenTradesFetch = (payload: IP2pOpenTrade): P2pOpenTradesFetch => ({
	type: OPEN_TRADES_FETCH,
	payload,
});

export const p2pOpenTradesData = (payload: IP2pTradesPayload): P2pOpenTradesData => ({
	type: OPEN_TRADES_DATA,
	payload,
});

export const p2pGetInfoTradeFetch = (payload: { id: number }): P2pGetInfoTradeFetch => ({
	type: INFO_TRADE_ITEM_FETCH,
	payload,
});

export const p2pGetInfoTradeData = (payload: IP2pTradesPayload): P2pGetInfoTradeData => ({
	type: INFO_TRADE_ITEM_DATA,
	payload,
});

export const p2pInfoTradeResetError = (): P2pInfoTradeResetError => ({
	type: INFO_TRADE_RESET_ERROR,
});
