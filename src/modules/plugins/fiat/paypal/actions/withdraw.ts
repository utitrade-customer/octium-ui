import { PaypalDepositHistoryState, PaypalWithdrawHistoryState } from '..';
import {
	PAYPAL_WITHDRAW_CREATE,
	PAYPAL_WITHDRAW_DATA,
	PAYPAL_WITHDRAW_HISTORY_DATA,
	PAYPAL_WITHDRAW_HISTORY_GET,
} from '../constants';

export interface PaypalWithdrawCreate {
	type: typeof PAYPAL_WITHDRAW_CREATE;
	payload: {
		currency_id: string;
		email: string;
		amount: number;
		otp: number;
	};
}

export interface PaypalWithdrawData {
	type: typeof PAYPAL_WITHDRAW_DATA;
	payload: PaypalDepositHistoryState;
}

export interface PaypalWithdrawHistoryGet {
	type: typeof PAYPAL_WITHDRAW_HISTORY_GET;
	payload: {
		currency_id: string;
	};
}
export interface PaypalWithdrawHistoryData {
	type: typeof PAYPAL_WITHDRAW_HISTORY_DATA;
	payload: PaypalWithdrawHistoryState;
}

export type PaypalWithdrawAction = PaypalWithdrawCreate | PaypalWithdrawData;
export type PaypalWithdrawHistory = PaypalWithdrawHistoryGet | PaypalWithdrawHistoryData;

export const createPaypalWithdraw = (payload: PaypalWithdrawCreate['payload']): PaypalWithdrawCreate => ({
	type: PAYPAL_WITHDRAW_CREATE,
	payload,
});

export const paypalWithdrawData = (payload: PaypalWithdrawData['payload']): PaypalWithdrawData => ({
	type: PAYPAL_WITHDRAW_DATA,
	payload,
});

export const getPaypalWithdrawHistory = (payload: PaypalWithdrawHistoryGet['payload']): PaypalWithdrawHistoryGet => ({
	type: PAYPAL_WITHDRAW_HISTORY_GET,
	payload,
});
export const paypalWithdrawHistoryData = (payload: PaypalWithdrawHistoryData['payload']): PaypalWithdrawHistoryData => ({
	type: PAYPAL_WITHDRAW_HISTORY_DATA,
	payload,
});
