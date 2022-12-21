import { PaypalDepositHistoryAction, PaypalDepositHistoryState } from '..';
import { PaypalDepositAction, PaypalRecentDepositAction } from '../actions/deposit';

import {
	PAYPAL_DEPOSIT_CREATE,
	PAYPAL_DEPOSIT_DATA,
	PAYPAL_DEPOSIT_HISTORY_DATA,
	PAYPAL_DEPOSIT_HISTORY_GET,
	PAYPAL_DEPOSIT_RECENT_DATA,
	PAYPAL_DEPOSIT_RECENT_GET,
} from '../constants';
import { PaypalDepositState, PaypalRecentDepositState } from '../types';

export const initialVerifyAaccount: PaypalDepositState = {
	payload: {},
	loading: false,
};
export const initialPaypalRecentDeposit: PaypalRecentDepositState = {
	payload: {},
	loading: false,
};
export const initialPaypalDepositHistory: PaypalDepositHistoryState = {
	payload: [],
	loading: false,
};

export const paypalDepositReducer = (state = initialVerifyAaccount, action: PaypalDepositAction): PaypalDepositState => {
	switch (action.type) {
		case PAYPAL_DEPOSIT_CREATE:
			return {
				...state,
				loading: true,
			};
		case PAYPAL_DEPOSIT_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
			};

		default:
			return state;
	}
};

export const paypalRecentDepositReducer = (
	state = initialPaypalRecentDeposit,
	action: PaypalRecentDepositAction,
): PaypalRecentDepositState => {
	switch (action.type) {
		case PAYPAL_DEPOSIT_RECENT_GET:
			return {
				...state,
				loading: true,
			};
		case PAYPAL_DEPOSIT_RECENT_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
			};

		default:
			return state;
	}
};

export const paypalDepositHistoryReducer = (
	state = initialPaypalDepositHistory,
	action: PaypalDepositHistoryAction,
): PaypalDepositHistoryState => {
	switch (action.type) {
		case PAYPAL_DEPOSIT_HISTORY_GET:
			return {
				...state,
				loading: true,
			};
		case PAYPAL_DEPOSIT_HISTORY_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
			};

		default:
			return state;
	}
};
