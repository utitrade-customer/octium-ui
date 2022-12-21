import {
	P2P_PRIVATE_ORDER_ADD,
	P2P_PRIVATE_CRUD_ORDER_LOADING,
	P2P_PRIVATE_ORDER_DATA,
	P2P_PRIVATE_ORDER_FETCH,
	P2P_PRIVATE_ORDER_UPDATE,
	P2P_PRIVATE_ORDER_CLOSED,
	P2P_PRIVATE_ORDER_FIND_DATA,
	P2P_PRIVATE_ORDER_FIND_FETCH,
	P2P_PRIVATE_ORDER_FIND_CHANGE,
	P2P_PRIVATE_ORDER_CHANGE,
} from './constants';
import {
	IP2PPrivateOrder,
	IP2PPrivateOrderAdd,
	IP2PPrivateOrderClosed,
	IP2PPrivateOrdersData,
	IP2PPrivateOrderUpdate,
	IPrivateOrderFetchParams,
	IsP2pOrdersCRUDLoading,
	P2pOrdersPrivateStateFindItemState,
} from './types';

export interface P2PPrivateOrdersFindItemFetch {
	type: typeof P2P_PRIVATE_ORDER_FIND_FETCH;
	payload: {
		id: number;
	};
}

export interface P2PPrivateOrdersFindItemData {
	type: typeof P2P_PRIVATE_ORDER_FIND_DATA;
	payload: P2pOrdersPrivateStateFindItemState;
}

export interface P2PPrivateOrdersFindItemChange {
	type: typeof P2P_PRIVATE_ORDER_FIND_CHANGE;
	payload: IP2PPrivateOrder;
}

export interface P2PPrivateOrdersFetch {
	type: typeof P2P_PRIVATE_ORDER_FETCH;
	payload: IPrivateOrderFetchParams;
}

export interface P2PPrivateOrdersData {
	type: typeof P2P_PRIVATE_ORDER_DATA;
	payload: IP2PPrivateOrdersData;
}

export interface P2PPrivateOrdersChange {
	type: typeof P2P_PRIVATE_ORDER_CHANGE;
	payload: IP2PPrivateOrder;
}

export interface P2pPrivateOrdersAdd {
	type: typeof P2P_PRIVATE_ORDER_ADD;
	payload: IP2PPrivateOrderAdd;
	callback: (to: string) => void;
}

export interface P2pPrivateOrdersUpdate {
	type: typeof P2P_PRIVATE_ORDER_UPDATE;
	payload: IP2PPrivateOrderUpdate;
	callback: (to: string) => void;
}

export interface P2pPrivateOrdersClosed {
	type: typeof P2P_PRIVATE_ORDER_CLOSED;
	payload: IP2PPrivateOrderClosed;
}

export interface P2pPrivateOrdersCRUDLoading {
	type: typeof P2P_PRIVATE_CRUD_ORDER_LOADING;
	payload: IsP2pOrdersCRUDLoading;
}

export type OrderConfigsActions =
	| P2PPrivateOrdersFindItemFetch
	| P2PPrivateOrdersFindItemData
	| P2PPrivateOrdersFindItemChange
	| P2PPrivateOrdersFetch
	| P2PPrivateOrdersData
	| P2PPrivateOrdersChange
	| P2pPrivateOrdersAdd
	| P2pPrivateOrdersClosed
	| P2pPrivateOrdersUpdate
	| P2pPrivateOrdersCRUDLoading;

export const p2pPrivateOrdersFindItemFetch = (payload: { id: number }): P2PPrivateOrdersFindItemFetch => ({
	type: P2P_PRIVATE_ORDER_FIND_FETCH,
	payload,
});

export const p2pPrivateOrdersFindItemData = (payload: P2pOrdersPrivateStateFindItemState): P2PPrivateOrdersFindItemData => ({
	type: P2P_PRIVATE_ORDER_FIND_DATA,
	payload,
});

export const p2pPrivateOrdersFindItemChange = (payload: IP2PPrivateOrder): P2PPrivateOrdersFindItemChange => ({
	type: P2P_PRIVATE_ORDER_FIND_CHANGE,
	payload,
});

export const p2pPrivateOrdersFetch = (payload: IPrivateOrderFetchParams): P2PPrivateOrdersFetch => ({
	type: P2P_PRIVATE_ORDER_FETCH,
	payload,
});

export const p2pPrivateOrdersData = (payload: IP2PPrivateOrdersData): P2PPrivateOrdersData => ({
	type: P2P_PRIVATE_ORDER_DATA,
	payload,
});

export const p2pPrivateOrdersChange = (payload: IP2PPrivateOrder): P2PPrivateOrdersChange => ({
	type: P2P_PRIVATE_ORDER_CHANGE,
	payload,
});

export const p2pPrivateOrdersAdd = (payload: IP2PPrivateOrderAdd, callback: (to: string) => void): P2pPrivateOrdersAdd => ({
	type: P2P_PRIVATE_ORDER_ADD,
	payload,
	callback,
});

export const p2pPrivateOrdersUpdate = (
	payload: IP2PPrivateOrderUpdate,
	callback: (to: string) => void,
): P2pPrivateOrdersUpdate => ({
	type: P2P_PRIVATE_ORDER_UPDATE,
	payload,
	callback,
});

export const p2pPrivateOrdersClosed = (payload: IP2PPrivateOrderClosed): P2pPrivateOrdersClosed => ({
	type: P2P_PRIVATE_ORDER_CLOSED,
	payload,
});

export const p2pPrivateOrdersCRUDLoading = (payload: IsP2pOrdersCRUDLoading): P2pPrivateOrdersCRUDLoading => ({
	type: P2P_PRIVATE_CRUD_ORDER_LOADING,
	payload,
});
