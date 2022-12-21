import {
	PRIVATE_MY_TRADE_DATA,
	PRIVATE_MY_TRADE_FETCH,
	PRIVATE_MY_TRADE_ITEM_DATA,
	PRIVATE_MY_TRADE_ITEM_FETCH,
	PRIVATE_MY_TRADE_NEW_ITEM_DATA,
} from './constants';
import {
	IP2pParamsPrivateTradesFetch,
	IP2pPayloadPrivateItemTrade,
	IP2pPayloadPrivateNewItemTrade,
	IP2pPayloadPrivateTrades,
} from './types';

export interface PrivateTradesFetch {
	type: typeof PRIVATE_MY_TRADE_FETCH;
	payload: IP2pParamsPrivateTradesFetch;
}

export interface PrivateTradesData {
	type: typeof PRIVATE_MY_TRADE_DATA;
	payload: IP2pPayloadPrivateTrades;
}

export interface PrivateTradeItemFetch {
	type: typeof PRIVATE_MY_TRADE_ITEM_FETCH;
}

export interface PrivateTradeItemData {
	type: typeof PRIVATE_MY_TRADE_ITEM_DATA;
	payload: IP2pPayloadPrivateItemTrade;
}

export interface PrivateTradeNewItemData {
	type: typeof PRIVATE_MY_TRADE_NEW_ITEM_DATA;
	payload: IP2pPayloadPrivateNewItemTrade;
}

export type PrivateTradeActions =
	| PrivateTradesFetch
	| PrivateTradesData
	| PrivateTradeItemFetch
	| PrivateTradeItemData
	| PrivateTradeNewItemData;

export const p2pPrivateTradesFetch = (payload: IP2pParamsPrivateTradesFetch): PrivateTradesFetch => ({
	type: PRIVATE_MY_TRADE_FETCH,
	payload,
});

export const p2pPrivateTradesData = (payload: IP2pPayloadPrivateTrades): PrivateTradesData => ({
	type: PRIVATE_MY_TRADE_DATA,
	payload,
});

export const p2pPrivateTradeItemFetch = (): PrivateTradeItemFetch => ({
	type: PRIVATE_MY_TRADE_ITEM_FETCH,
});

export const p2pPrivateTradeItemData = (payload: IP2pPayloadPrivateItemTrade): PrivateTradeItemData => ({
	type: PRIVATE_MY_TRADE_ITEM_DATA,
	payload: payload,
});

export const p2pPrivateTradeNewItemData = (payload: IP2pPayloadPrivateNewItemTrade): PrivateTradeNewItemData => ({
	type: PRIVATE_MY_TRADE_NEW_ITEM_DATA,
	payload: payload,
});
