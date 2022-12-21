import {
	PUBLIC_ORDER_CHANGE,
	PUBLIC_ORDER_DATA,
	PUBLIC_ORDER_RESET_ERROR,
	PUBLIC_ORDER_FETCH,
	PUBLIC_ORDER_ITEM_DATA,
	PUBLIC_ORDER_ITEM_FETCH,
} from './constants';
import { IItemPublicOrder, IPayloadPublicOrderItemFetch, IPublicOrderFetchParams, P2pPublicOrdersState } from './types';

export interface PublicOrderFetch {
	type: typeof PUBLIC_ORDER_FETCH;
	payload: IPublicOrderFetchParams;
}

export interface PublicOrderData {
	type: typeof PUBLIC_ORDER_DATA;
	payload: P2pPublicOrdersState;
}

export interface PublicOrderItemFetch {
	type: typeof PUBLIC_ORDER_ITEM_FETCH;
	payload: { id: number };
}

export interface PublicOrderItemData {
	type: typeof PUBLIC_ORDER_ITEM_DATA;
	payload: IPayloadPublicOrderItemFetch;
}

export interface PublicOrderChange {
	type: typeof PUBLIC_ORDER_CHANGE;
	payload: IItemPublicOrder;
}

export interface PublicOrderResetError {
	type: typeof PUBLIC_ORDER_RESET_ERROR;
}

export type OrderPublicOrdersActions =
	| PublicOrderFetch
	| PublicOrderData
	| PublicOrderItemFetch
	| PublicOrderItemData
	| PublicOrderChange
	| PublicOrderResetError;

export const p2pPublicOrderFetch = (payload: IPublicOrderFetchParams): PublicOrderFetch => ({
	type: PUBLIC_ORDER_FETCH,
	payload,
});

export const p2pPublicOrderData = (payload: P2pPublicOrdersState): PublicOrderData => ({
	type: PUBLIC_ORDER_DATA,
	payload,
});

export const p2pPublicOrderItemFetch = (payload: { id: number }): PublicOrderItemFetch => ({
	type: PUBLIC_ORDER_ITEM_FETCH,
	payload,
});

export const p2pPublicOrderItemData = (payload: IPayloadPublicOrderItemFetch): PublicOrderItemData => ({
	type: PUBLIC_ORDER_ITEM_DATA,
	payload: payload,
});

export const p2pPublicOrderDataChange = (payload: IItemPublicOrder): PublicOrderChange => ({
	type: PUBLIC_ORDER_CHANGE,
	payload,
});

export const p2pPublicOrderResetError = (): PublicOrderResetError => ({
	type: PUBLIC_ORDER_RESET_ERROR,
});
