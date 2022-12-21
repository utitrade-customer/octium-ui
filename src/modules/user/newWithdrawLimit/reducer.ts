import { NewWithdrawLimitCheckingState, NewWithdrawLimitRemainsState, WithdrawLimitCheckingActions } from '.';
import { WithdrawLimitFetchRemainsActions, WithdrawLimitFeeAction } from './actions';
import {
	WITHDRAW_LIMIT_CHECKING,
	WITHDRAW_LIMIT_CHECKING_RESPONSE,
	WITHDRAW_LIMIT_FETCH_REMAINS,
	WITHDRAW_LIMIT_FETCH_REMAINS_DATA,
	WITHDRAW_LIMIT_FEE_FETCH,
	WITHDRAW_LIMIT_FEE_DATA,
	WITHDRAW_LIMIT_FEE_ERROR,
} from './constants';
import { WithdrawLimitFeeState } from './types';
const initStateRemain = {
	payload: {
		remains: 0,
		limit: 0,
	},
	loading: false,
};

const initStateCheckingRemain = {
	payload: {
		isEnough: false,
		message: '',
	},
	loading: false,
};
export const initWithdrawlimitFee = {
	data: [],
	loading: false,
};

export const withdrawLimitRemainReducer = (
	state = initStateRemain,
	action: WithdrawLimitFetchRemainsActions,
): NewWithdrawLimitRemainsState => {
	switch (action.type) {
		case WITHDRAW_LIMIT_FETCH_REMAINS:
			return {
				...state,
				loading: true,
			};
		case WITHDRAW_LIMIT_FETCH_REMAINS_DATA:
			return {
				...state,
				payload: action.payload,
				loading: false,
			};
		default:
			return {
				...state,
				loading: false,
			};
	}
};

export const withdrawLimitCheckingReducer = (
	state = initStateCheckingRemain,
	action: WithdrawLimitCheckingActions,
): NewWithdrawLimitCheckingState => {
	switch (action.type) {
		case WITHDRAW_LIMIT_CHECKING: {
			return {
				...initStateCheckingRemain,
				loading: true,
			};
		}
		case WITHDRAW_LIMIT_CHECKING_RESPONSE: {
			return {
				...state,
				payload: action.payload,
				loading: false,
			};
		}
		default:
			return {
				...state,
				loading: false,
			};
	}
};
export const withdrawLimitFeeReducer = (state = initWithdrawlimitFee, action: WithdrawLimitFeeAction): WithdrawLimitFeeState => {
	switch (action.type) {
		case WITHDRAW_LIMIT_FEE_FETCH:
			// console.log("reducer")
			return {
				...state,
				loading: true,
			};
		case WITHDRAW_LIMIT_FEE_DATA:
			return {
				...state,
				loading: false,
				data: action.payload,
			};
		case WITHDRAW_LIMIT_FEE_ERROR:
			return {
				...state,
				loading: true,
				data: [],
			};
		default:
			return {
				...state,
				loading: false,
			};
	}
};
