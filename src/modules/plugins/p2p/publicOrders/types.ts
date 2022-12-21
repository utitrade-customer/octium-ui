import { CommonError, CommonState } from 'modules/types';
import { IInfoUserPublic } from '../infoUser';
import { IP2PPrivateOrder } from '../orders';
import { IPayload } from '../type/interface.common';

export interface IItemPublicOrder extends IP2PPrivateOrder {
	owner: Owner;
}

export interface Owner extends IInfoUserPublic {}

export interface P2pPublicOrdersState extends CommonState {
	payload: IPayload<IItemPublicOrder[]>;
	loading: boolean;
}

export interface IPublicOrderFetchParams {
	page?: number;
	currency: string;
	fiat: string;
	orderMin?: number;
	payment?: number;
	limit?: number;
	type: 'buy' | 'sell';
	sort?: string;
}

export interface IPayloadPublicOrderItemFetch {
	item?: IItemPublicOrder;
	error?: CommonError;
}
