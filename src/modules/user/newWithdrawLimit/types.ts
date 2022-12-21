import { CommonState } from '../../../modules/types';

export interface NewWithdrawLimitRemainsState {
	payload: {
		remains: number;
		limit: number;
	};
	loading: boolean;
}

export interface NewWithdrawLimitCheckingState {
	payload: {
		isEnough: boolean;
		message: string;
	};
	loading: boolean;
}
export interface WithdrawLimitFee {
	id: number;
	level: number;
	limit: number | string;
}
export interface WithdrawLimitFeeState extends CommonState {
	data: WithdrawLimitFee[];
	loading: boolean;
}
