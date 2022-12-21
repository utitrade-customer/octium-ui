import { RootState } from 'modules';

export const selectReportsLoading = (state: RootState) => state.plugins.p2p.p2pReports.loading;
export const selectReports = (state: RootState) => state.plugins.p2p.p2pReports.data;

export const selectCreateReportLoading = (state: RootState) => state.plugins.p2p.createP2PReport.loading;
