import {
	BALANCES_CHANGED,
	BALANCES_DATA,
	BALANCES_FETCH,
	FIND_BALANCES_CHANGED,
	FIND_BALANCES_DATA,
	FIND_BALANCES_FETCH,
	HISTORY_BALANCES_DATA,
	HISTORY_BALANCES_FETCH,
	P2P_TRANSFERS_TOKEN,
	VALUE_BALANCES_CHANGED,
	VALUE_BALANCES_DATA,
	VALUE_BALANCES_FETCH,
} from './constants';
import {
	BalancesState,
	FindBalanceTokenState,
	HistoryBalancesState,
	IBalance,
	IHistoryBalanceQuery,
	IOptionQuery,
	IP2pFindBalance,
	IP2pTransferToken,
} from './types';

export interface BalancesFetch {
	type: typeof BALANCES_FETCH;
	payload: IOptionQuery;
}

export interface BalancesData {
	type: typeof BALANCES_DATA;
	payload: BalancesState;
}

export interface BalancesChanged {
	type: typeof BALANCES_CHANGED;
	payload: IBalance;
}

export interface ValueBalancesFetch {
	type: typeof VALUE_BALANCES_FETCH;
}

export interface ValueBalancesData {
	type: typeof VALUE_BALANCES_DATA;
	payload: BalancesState;
}

export interface ValueBalancesChanged {
	type: typeof VALUE_BALANCES_CHANGED;
	payload: IBalance;
}

export interface HistoryBalancesFetch {
	type: typeof HISTORY_BALANCES_FETCH;
	payload: IHistoryBalanceQuery;
}

export interface HistoryBalancesData {
	type: typeof HISTORY_BALANCES_DATA;
	payload: HistoryBalancesState;
}

export interface TransferToken {
	type: typeof P2P_TRANSFERS_TOKEN;
	payload: IP2pTransferToken;
	callback: () => void;
}

export interface FindBalancesFetch {
	type: typeof FIND_BALANCES_FETCH;
	payload: IP2pFindBalance;
}

export interface FindBalancesData {
	type: typeof FIND_BALANCES_DATA;
	payload: FindBalanceTokenState;
}

export interface FindBalancesChanged {
	type: typeof FIND_BALANCES_CHANGED;
	payload: IBalance;
}

export type P2pBalancesActions =
	| BalancesFetch
	| BalancesData
	| HistoryBalancesFetch
	| HistoryBalancesData
	| BalancesChanged
	| TransferToken
	| ValueBalancesFetch
	| ValueBalancesData
	| ValueBalancesChanged
	| FindBalancesFetch
	| FindBalancesData
	| FindBalancesChanged;

export const p2pBalancesFetch = (payload: IOptionQuery): BalancesFetch => ({
	type: BALANCES_FETCH,
	payload,
});

export const p2pBalancesData = (payload: BalancesState): BalancesData => ({
	type: BALANCES_DATA,
	payload,
});

export const p2pBalancesChanged = (payload: IBalance): BalancesChanged => ({
	type: BALANCES_CHANGED,
	payload,
});

export const p2pValueBalancesFetch = (): ValueBalancesFetch => ({
	type: VALUE_BALANCES_FETCH,
});

export const p2pValueBalancesData = (payload: BalancesState): ValueBalancesData => ({
	type: VALUE_BALANCES_DATA,
	payload,
});

export const p2pValueBalancesChanged = (payload: IBalance): ValueBalancesChanged => ({
	type: VALUE_BALANCES_CHANGED,
	payload,
});

export const p2pTransferToken = (payload: IP2pTransferToken, callback: () => void): TransferToken => ({
	type: P2P_TRANSFERS_TOKEN,
	payload,
	callback,
});

export const p2pFindBalanceFetch = (payload: IP2pFindBalance): FindBalancesFetch => ({
	type: FIND_BALANCES_FETCH,
	payload,
});

export const p2pFindBalanceData = (payload: FindBalanceTokenState): FindBalancesData => ({
	type: FIND_BALANCES_DATA,
	payload,
});

export const p2pFindBalanceChanged = (payload: IBalance): FindBalancesChanged => ({
	type: FIND_BALANCES_CHANGED,
	payload,
});

export const p2pHistoryBalancesFetch = (payload: IHistoryBalanceQuery): HistoryBalancesFetch => ({
	type: HISTORY_BALANCES_FETCH,
	payload,
});

export const p2pHistoryBalancesData = (payload: HistoryBalancesState): HistoryBalancesData => ({
	type: HISTORY_BALANCES_DATA,
	payload,
});
