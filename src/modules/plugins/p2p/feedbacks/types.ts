import { CommonState } from 'modules/types';
import { IPayload } from '../type/interface.common';

export interface IP2PFeedback {}

export interface P2pFeedbacksState extends CommonState {
	data: IPayload<IP2PFeedback[]>;
	loading: boolean;
}

export interface P2pFeedbacksPayload extends CommonState {
	payload?: IPayload<IP2PFeedback[]>;
}
