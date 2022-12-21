import { RootState } from 'modules';

export const selectP2pBalancesLoading = (state: RootState) => state.plugins.p2p.balances.loading;
export const selectP2pBalances = (state: RootState) => state.plugins.p2p.balances.payload;

export const selectP2pValueBalancesLoading = (state: RootState) => state.plugins.p2p.valueBalances.loading;
export const selectP2pValueBalances = (state: RootState) => state.plugins.p2p.valueBalances.payload;

export const selectP2pHistoryBalancesLoading = (state: RootState) => state.plugins.p2p.historyBalances.loading;
export const selectP2pHistoryBalances = (state: RootState) => state.plugins.p2p.historyBalances.payload;

export const selectP2pFindBalanceTokenLoading = (state: RootState) => state.plugins.p2p.findBalanceToken.loading;
export const selectP2pFindBalanceToken = (state: RootState) => state.plugins.p2p.findBalanceToken.payload;
