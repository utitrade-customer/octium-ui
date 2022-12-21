import { PaypalWithdrawHistory } from '../actions/withdraw';
import { PAYPAL_WITHDRAW_HISTORY_DATA, PAYPAL_WITHDRAW_HISTORY_GET } from '../constants';
import { PaypalWithdrawHistoryState } from '../types';

export const initialPaypalWithdrawHistory: PaypalWithdrawHistoryState = {
	payload: [],
	loading: false,
};

export const paypalWithdrawHistoryReducer = (
	state = initialPaypalWithdrawHistory,
	action: PaypalWithdrawHistory,
): PaypalWithdrawHistoryState => {
	switch (action.type) {
		case PAYPAL_WITHDRAW_HISTORY_GET:
			return {
				...state,
				loading: true,
			};
		case PAYPAL_WITHDRAW_HISTORY_DATA:
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
