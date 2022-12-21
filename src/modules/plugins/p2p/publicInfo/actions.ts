import { INFO_SUPPORTED_FETCH, INFO_SUPPORTED_DATA, PRICE_SUPPORTED_DATA, PRICE_SUPPORTED_FETCH } from './constants';
import { InfoPriceP2pFetch, InfoPriceSupportedState, InfoSupportedState } from './types';

export interface InfoSupportedFetch {
	type: typeof INFO_SUPPORTED_FETCH;
}

export interface InfoSupportedData {
	type: typeof INFO_SUPPORTED_DATA;
	payload: InfoSupportedState;
}

export interface InfoPriceSupportedFetch {
	type: typeof PRICE_SUPPORTED_FETCH;
	payload: InfoPriceP2pFetch;
}

export interface InfoPriceSupportedData {
	type: typeof PRICE_SUPPORTED_DATA;
	payload: InfoPriceSupportedState;
}

export type OrderPublicSupportedActions =
	| InfoPriceSupportedFetch
	| InfoPriceSupportedData
	| InfoSupportedFetch
	| InfoSupportedData;

export const infoSupportedFetch = (): InfoSupportedFetch => ({
	type: INFO_SUPPORTED_FETCH,
});

export const infoSupportedData = (payload: InfoSupportedState): InfoSupportedData => ({
	type: INFO_SUPPORTED_DATA,
	payload,
});

export const infoPriceSupportedFetch = (payload: InfoPriceP2pFetch): InfoPriceSupportedFetch => ({
	type: PRICE_SUPPORTED_FETCH,
	payload,
});

export const infoPriceSupportedData = (payload: InfoPriceSupportedState): InfoPriceSupportedData => ({
	type: PRICE_SUPPORTED_DATA,
	payload,
});
