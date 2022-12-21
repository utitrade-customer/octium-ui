import { CommonState } from '../../../../modules/types';

export enum BankType {
	Bank = 'bank',
}

export interface BankAccount {
	id: number;
	uid: string;
	ifsc_code: string;
	bank_name: string;
	bank_address: string;
	account_name: string;
	account_number: string;
	created_at: Date;
	updated_at: Date;
}

export interface BankDeposit {
	id: number;
	uid: string;
	txid: string;
	deposit_code: string;
	amount: string;
	fee: string;
	amount_received: string;
	state: 'pending' | 'succeed' | 'rejected';
	created_at: Date;
	updated_at: Date;
	type: 'fiat';
	currency_id: string;
}

export interface BankWithdraw {
	id: number;
	txid: string;
	bank_id: number;
	uid: string;
	deposit_code: string;
	currency_id: string;
	account_number: string;
	ifsc_code: string;
	bank_address: string;
	account_name: string;
	amount: string;
	fee: string;
	amount_received: string;
	state: 'pending' | 'succeed' | 'rejected';
	created_at: Date;
	updated_at: Date;
	type: 'fiat';
}

// Bank Interfaces

export interface BankAccountListState extends CommonState {
	payload: BankAccount[];
	loading: boolean;
}

export interface CreateBankAccountState extends CommonState {
	loading: boolean;
}

export interface DeleteBankAccountState extends CommonState {
	loading: boolean;
}

// Bank Deposit Interfaces

export interface BankDepositHistoryListState extends CommonState {
	payload: BankDeposit[];
	loading: boolean;
}

export interface CreateBankDepositState extends CommonState {
	loading: boolean;
}

// Bank Withdraw Interfaces

export interface BankWithdrawHistoryListState extends CommonState {
	payload: BankWithdraw[];
	loading: boolean;
}

export interface CreateBankWithdrawState extends CommonState {
	loading: boolean;
}
