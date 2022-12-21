import { ReportConfigsActions } from './actions';
import { P2P_CREATE_REPORT_LOADING, P2P_REPORT_DATA, P2P_REPORT_FETCH } from './constants';
import { CreateReportState, P2pReportsState } from './types';

export const initialReports: P2pReportsState = {
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

export const initialCreateP2PReport: CreateReportState = {
	loading: false,
};

export const p2pReportsReducer = (state = initialReports, action: ReportConfigsActions): P2pReportsState => {
	switch (action.type) {
		case P2P_REPORT_FETCH: {
			return {
				...state,
				loading: true,
			};
		}

		case P2P_REPORT_DATA: {
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

export const createP2PReportReducer = (state = initialCreateP2PReport, action: ReportConfigsActions) => {
	switch (action.type) {
		case P2P_CREATE_REPORT_LOADING:
			const { loading } = action.payload;
			return { ...state, loading, error: undefined };
		default:
			return state;
	}
};
