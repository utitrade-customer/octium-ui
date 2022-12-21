import { CommonState } from '../../../../modules/types';

export interface Bank {
	id: number;
	bank_name: string;
}

export interface BankListState extends CommonState {
	payload: Bank[];
	loading: boolean;
}
