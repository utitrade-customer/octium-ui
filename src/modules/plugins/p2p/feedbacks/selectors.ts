import { RootState } from 'modules';

export const selectFeedbacksLoading = (state: RootState) => state.plugins.p2p.p2pFeedbacks.loading;
export const selectFeedbacks = (state: RootState) => state.plugins.p2p.p2pFeedbacks.data;
