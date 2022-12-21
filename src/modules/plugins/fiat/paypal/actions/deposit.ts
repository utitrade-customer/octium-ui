import { PaypalDepositHistoryState, PaypalRecentDepositState } from '..';
import {
	PAYPAL_DEPOSIT_CREATE,
	PAYPAL_DEPOSIT_DATA,
	PAYPAL_DEPOSIT_HISTORY_DATA,
	PAYPAL_DEPOSIT_HISTORY_GET,
	PAYPAL_DEPOSIT_RECENT_DATA,
	PAYPAL_DEPOSIT_RECENT_GET,
} from '../constants';
import { PaypalDepositState, PaypalType } from '../types';

export interface PaypalDepositCreate {
	type: typeof PAYPAL_DEPOSIT_CREATE;
	payload: {
		currency_id: string;
		amount: number;
		type: PaypalType.Paypal;
	};
}

export interface PaypalDepositData {
	type: typeof PAYPAL_DEPOSIT_DATA;
	payload: PaypalDepositState;
}

export interface PaypalRecentDepositGet {
	type: typeof PAYPAL_DEPOSIT_RECENT_GET;
	payload: {
		currency_id: string;
	};
}
export interface PaypalRecentDepositData {
	type: typeof PAYPAL_DEPOSIT_RECENT_DATA;
	payload: PaypalRecentDepositState;
}

export interface PaypalDepositHistoryGet {
	type: typeof PAYPAL_DEPOSIT_HISTORY_GET;
	payload: {
		currency_id: string;
	};
}

export interface PaypalDepositHistoryData {
	type: typeof PAYPAL_DEPOSIT_HISTORY_DATA;
	payload: PaypalDepositHistoryState;
}

export type PaypalDepositAction = PaypalDepositCreate | PaypalDepositData;
export type PaypalRecentDepositAction = PaypalRecentDepositGet | PaypalRecentDepositData;
export type PaypalDepositHistoryAction = PaypalDepositHistoryGet | PaypalDepositHistoryData;

export const createPaypalDeposit = (payload: PaypalDepositCreate['payload']): PaypalDepositCreate => ({
	type: PAYPAL_DEPOSIT_CREATE,
	payload,
});

export const paypalDepositData = (payload: PaypalDepositData['payload']): PaypalDepositData => ({
	type: PAYPAL_DEPOSIT_DATA,
	payload,
});

export const getRecentPaypalDeposit = (payload: PaypalRecentDepositGet['payload']): PaypalRecentDepositGet => ({
	type: PAYPAL_DEPOSIT_RECENT_GET,
	payload,
});

export const recentPaypalDepositData = (payload: PaypalRecentDepositData['payload']): PaypalRecentDepositData => ({
	type: PAYPAL_DEPOSIT_RECENT_DATA,
	payload,
});
export const getPaypalDepositHistory = (payload: PaypalDepositHistoryGet['payload']): PaypalDepositHistoryGet => ({
	type: PAYPAL_DEPOSIT_HISTORY_GET,
	payload,
});

export const paypalDepositHistoryData = (payload: PaypalDepositHistoryData['payload']): PaypalDepositHistoryData => ({
	type: PAYPAL_DEPOSIT_HISTORY_DATA,
	payload,
});
