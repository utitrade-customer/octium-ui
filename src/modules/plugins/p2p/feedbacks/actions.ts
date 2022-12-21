import { P2P_FEEDBACK_DATA, P2P_FEEDBACK_FETCH } from './constants';
import { P2pFeedbacksPayload } from './types';

export interface P2PFeedbacksFetch {
	type: typeof P2P_FEEDBACK_FETCH;
}

export interface P2PFeedbacksFetchData {
	type: typeof P2P_FEEDBACK_DATA;
	payload: P2pFeedbacksPayload;
}

export type FeedbackConfigsActions = P2PFeedbacksFetch | P2PFeedbacksFetchData;

export const p2PFeedbacksFetch = (): P2PFeedbacksFetch => ({
	type: P2P_FEEDBACK_FETCH,
});

export const p2PFeedbacksFetchData = (payload: P2pFeedbacksPayload): P2PFeedbacksFetchData => ({
	type: P2P_FEEDBACK_DATA,
	payload,
});
