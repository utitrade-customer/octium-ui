import { CommonState } from '../../../../modules/types';

export enum PaypalType {
	Paypal = 'paypal',
}
export interface PaypalRecentDeposit {
	deposit_id?: string;
	currency_id?: string;
	remain_minutes?: number;
	state?: string;
	end_time?: Date;
	payment_token?: string;
	payment_link?: string;
}
export interface PaypalDepositState extends CommonState {
	payload: PaypalRecentDeposit;
	loading: boolean;
}

export interface PaypalRecentDepositState extends CommonState {
	payload: PaypalRecentDeposit;
	loading: boolean;
}

export interface PaypalDepositHistory {
	deposit_id: string;
	currency_id: string;
	state: string;
	amount: number;
	fee: number;
	created_at: Date;
	payment_id?: string;
}

export interface PaypalDepositHistoryState extends CommonState {
	payload: PaypalDepositHistory[];
	loading: boolean;
}

// Withdraw
export interface PaypalWithdrawHistory {
	amount: number;
	email: string;
	txid: string;
	aasm_state: string;
	created_at: Date;
}
export interface PaypalWithdrawHistoryState extends CommonState {
	payload: PaypalWithdrawHistory[];
	loading: boolean;
}
