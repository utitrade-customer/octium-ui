import { OrderPublicSupportedActions } from './actions';
import { INFO_SUPPORTED_FETCH, INFO_SUPPORTED_DATA, PRICE_SUPPORTED_FETCH, PRICE_SUPPORTED_DATA } from './constants';
import { InfoPriceSupportedState, InfoSupportedState } from './types';

export const initialInfoSupported: InfoSupportedState = {
	payload: {
		minutesTimePerTran: 0,
		fiatSupported: [],
		currencySupported: [],
		paymentSupported: [],
	},
	loading: false,
};

export const p2pPublicInfosSupportedReducer = (
	state = initialInfoSupported,
	action: OrderPublicSupportedActions,
): InfoSupportedState => {
	switch (action.type) {
		case INFO_SUPPORTED_FETCH:
			return {
				...state,
				loading: true,
			};
		case INFO_SUPPORTED_DATA:
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

export const initialInfoPriceSupported: InfoPriceSupportedState = {
	payload: {
		higher: 0,
		lower: 0,
	},
	loading: false,
};

export const p2pPublicPriceSupportedReducer = (
	state = initialInfoPriceSupported,
	action: OrderPublicSupportedActions,
): InfoPriceSupportedState => {
	switch (action.type) {
		case PRICE_SUPPORTED_FETCH:
			return {
				...state,
				loading: true,
			};
		case PRICE_SUPPORTED_DATA:
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
