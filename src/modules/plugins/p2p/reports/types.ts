import { CommonState } from 'modules/types';
import { IPayload } from '../type/interface.common';

export interface IP2PReport {}

export interface P2pReportsState extends CommonState {
	data: IPayload<IP2PReport[]>;
	loading: boolean;
}

export interface P2pReportsPayload extends CommonState {
	payload?: IPayload<IP2PReport[]>;
}

export interface CreateReportState extends CommonState {
	loading: boolean;
}
