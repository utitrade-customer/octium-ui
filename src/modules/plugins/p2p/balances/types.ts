import { CommonState } from 'modules/types';
import { IPayload } from '../type/interface.common';

export interface IHistoryBalance {
	id: number;
	currencyId: string;
	referenceType: string;
	referenceId: number;
	debit: number;
	credit: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface IDataFindBalance {
	token?: IBalance;
	error: boolean;
}

export interface HistoryBalancesState extends CommonState {
	payload: IPayload<IHistoryBalance[]>;
	loading: boolean;
}

export type THistoryBalanceType = 'Order' | 'Trade' | 'Transfer';
export interface IHistoryBalanceQuery {
	sort?: string;
	page?: number;
	limit?: number;
	type?: THistoryBalanceType;
	startedAt?: Date;
	endedAt?: Date;
}

export interface IP2pFindBalance {
	name: string;
}

export interface FindBalanceTokenState extends CommonState {
	payload: IDataFindBalance;
	loading: boolean;
}

///--------------------------------------------------------

export interface IBalance {
	currency: string;
	locked: number;
	balance: number;
}

export interface IOptionQuery {
	page?: number;
	limit?: number;
	order?: 'DESC' | 'ASC';
	hidden?: boolean;
}

export interface IMetaPage {
	page: number;
	limit: number;
	itemCount: number;
	pageCount: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

export interface IDataBalance {
	data: IBalance[];
	meta: IMetaPage;
}

export interface BalancesState extends CommonState {
	payload: IDataBalance;
	loading: boolean;
}

export interface IP2pTransferToken {
	currency: string;
	amount: number;
	type: 'RECEIVE' | 'SEND';
}
