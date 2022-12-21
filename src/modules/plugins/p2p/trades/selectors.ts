import { RootState } from 'modules';

export const selectP2pTradesDetailLoading = (state: RootState) => state.plugins.p2p.p2pTrades.loading;
export const selectP2pTradesDetail = (state: RootState) => state.plugins.p2p.p2pTrades.data;
export const selectErrorP2pTradesDetail = (state: RootState) => state.plugins.p2p.p2pTrades.error;
