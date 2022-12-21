import { FeedbackConfigsActions } from './actions';
import { P2P_FEEDBACK_DATA, P2P_FEEDBACK_FETCH } from './constants';
import { P2pFeedbacksState } from './types';

export const initialFeedbacks: P2pFeedbacksState = {
	data: {
		data: [],
		meta: {
			page: 1,
			limit: 0,
			itemCount: 0,
			pageCount: 1,
			hasPreviousPage: false,
			hasNextPage: false,
		},
	},
	loading: false,
};

export const p2pFeedbacksReducer = (state = initialFeedbacks, action: FeedbackConfigsActions): P2pFeedbacksState => {
	switch (action.type) {
		case P2P_FEEDBACK_FETCH: {
			return {
				...state,
				loading: true,
			};
		}

		case P2P_FEEDBACK_DATA: {
			const { payload, error } = action.payload;
			return {
				...state,
				data: payload ? payload : { ...state.data },
				error,
			};
		}

		default:
			return state;
	}
};
