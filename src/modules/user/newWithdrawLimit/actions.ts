import { NewWithdrawLimitCheckingState, NewWithdrawLimitRemainsState } from '.';
import {
	WITHDRAW_LIMIT_CHECKING,
	WITHDRAW_LIMIT_CHECKING_RESPONSE,
	WITHDRAW_LIMIT_FETCH_REMAINS,
	WITHDRAW_LIMIT_FETCH_REMAINS_DATA,
	WITHDRAW_LIMIT_FEE_FETCH,
	WITHDRAW_LIMIT_FEE_DATA,
	WITHDRAW_LIMIT_FEE_ERROR,
} from './constants';
// import { CommonError } from '../../types';
import { WithdrawLimitFee } from './types';

export interface WithdrawLimitFetchRemains {
	type: typeof WITHDRAW_LIMIT_FETCH_REMAINS;
}

export interface WithdrawLimitFetchRemainsData extends NewWithdrawLimitRemainsState {
	type: typeof WITHDRAW_LIMIT_FETCH_REMAINS_DATA;
}

export interface WithdrawLimitChecking {
	type: typeof WITHDRAW_LIMIT_CHECKING;
	payload: {
		currency_id: string;
		total_withdraw: number;
	};
}
export interface WithdrawLimitCheckingResponse extends NewWithdrawLimitCheckingState {
	type: typeof WITHDRAW_LIMIT_CHECKING_RESPONSE;
}

export interface WithdrawLimitFeeFetch {
	type: typeof WITHDRAW_LIMIT_FEE_FETCH;
}
export interface WithdrawLimitFeeData {
	type: typeof WITHDRAW_LIMIT_FEE_DATA;
	payload: WithdrawLimitFee[];
}
export interface WithdrawLimitFeeError {
	type: typeof WITHDRAW_LIMIT_FEE_ERROR;
	payload: {};
}

export type WithdrawLimitFetchRemainsActions = WithdrawLimitFetchRemains | WithdrawLimitFetchRemainsData;
export type WithdrawLimitCheckingActions = WithdrawLimitChecking | WithdrawLimitCheckingResponse;
export const withdrawLimitFetchRemains = (): WithdrawLimitFetchRemains => ({
	type: WITHDRAW_LIMIT_FETCH_REMAINS,
});

export type WithdrawLimitFeeAction = WithdrawLimitFeeFetch | WithdrawLimitFeeData | WithdrawLimitFeeError;

export const withdrawLimitRemainsData = (payload: WithdrawLimitFetchRemainsData['payload']): WithdrawLimitFetchRemainsData => ({
	type: WITHDRAW_LIMIT_FETCH_REMAINS_DATA,
	payload,
	loading: false,
});

export const withdrawLimitChecking = (payload: WithdrawLimitChecking['payload']): WithdrawLimitChecking => ({
	type: WITHDRAW_LIMIT_CHECKING,
	payload,
});

export const withdrawLimitCheckingResponse = (
	payload: WithdrawLimitCheckingResponse['payload'],
): WithdrawLimitCheckingResponse => ({
	type: WITHDRAW_LIMIT_CHECKING_RESPONSE,
	payload,
	loading: false,
});

export const fetchWithdrawLimitFee = (): WithdrawLimitFeeFetch => ({
	type: WITHDRAW_LIMIT_FEE_FETCH,
});
export const fetchWithdrawLimitFeeData = (payload: WithdrawLimitFee[]): WithdrawLimitFeeData => ({
	type: WITHDRAW_LIMIT_FEE_DATA,
	payload,
});
export const fetchWithdrawLimitFeeError = (payload: WithdrawLimitFeeError['payload']): WithdrawLimitFeeError => ({
	type: WITHDRAW_LIMIT_FEE_ERROR,
	payload,
});
