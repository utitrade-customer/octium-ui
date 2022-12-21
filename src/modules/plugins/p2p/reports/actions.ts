import { P2P_CREATE_REPORT, P2P_CREATE_REPORT_LOADING, P2P_REPORT_DATA, P2P_REPORT_FETCH } from './constants';
import { CreateReportState, P2pReportsPayload } from './types';

export interface P2PReportsFetch {
	type: typeof P2P_REPORT_FETCH;
}

export interface P2PReportsFetchData {
	type: typeof P2P_REPORT_DATA;
	payload: P2pReportsPayload;
}

export interface CreateP2PReport {
	type: typeof P2P_CREATE_REPORT;
	payload: {
		userID: string;
		trade: number;
		reason: number;
		description: string;
		images: string[];
	};
}
export type CreateP2PReportPayload = Omit<CreateP2PReport['payload'], 'userID'>;

export interface CreateP2PReportData {
	type: typeof P2P_CREATE_REPORT_LOADING;
	payload: CreateReportState;
}

export type ReportConfigsActions = P2PReportsFetch | P2PReportsFetchData | CreateP2PReport | CreateP2PReportData;

export const p2PReportsFetch = (): P2PReportsFetch => ({
	type: P2P_REPORT_FETCH,
});

export const p2PReportsFetchData = (payload: P2pReportsPayload): P2PReportsFetchData => ({
	type: P2P_REPORT_DATA,
	payload,
});

export const createP2PReport = (payload: CreateP2PReport['payload']): CreateP2PReport => ({
	type: P2P_CREATE_REPORT,
	payload,
});

export const createP2PReportData = (payload: CreateP2PReportData['payload']): CreateP2PReportData => ({
	type: P2P_CREATE_REPORT_LOADING,
	payload,
});
