import { CommonState } from 'modules/types';

export interface CurrencySupported {
	id: string;
	minAmount: number;
	maxAmount: number;
}

export interface FiatSupported {
	id: string;
	symbol: string;
	minAmount: number;
	maxAmount: number;
	decimal: number;
	img?: string;
}

export interface PaymentSupported {
	id: number;
	name: string;
	fields: Field[];
}

export interface Field {
	name: string;
	label: string;
	type: TypeFieldPaymentP2p;
	required: boolean;
}

export enum TypeFieldPaymentP2p {
	Img = 'image',
	Text = 'text',
	Number = 'number',
	Mail = 'mail',
}

export interface IInfoSupported {
	minutesTimePerTran: number;
	currencySupported: CurrencySupported[];
	fiatSupported: FiatSupported[];
	paymentSupported: PaymentSupported[];
}

export interface InfoSupportedState extends CommonState {
	payload: IInfoSupported;
	loading: boolean;
}

export interface InfoPriceP2pFetch {
	currencyId: string;
	fiatId: string;
}
export interface InfoPriceP2p {
	higher: number;
	lower: number;
}
export interface InfoPriceSupportedState extends CommonState {
	payload: InfoPriceP2p;
	loading: boolean;
}
