import { RootState } from 'modules';

export const selectPrivateTradesLoading = (state: RootState) => state.plugins.p2p.p2pMyTrades.loading;
export const selectPrivateTrades = (state: RootState) => state.plugins.p2p.p2pMyTrades.data;

export const selectPrivateTradesNewItemLoading = (state: RootState) => state.plugins.p2p.p2pMyNewItemTrades.loading;
export const selectPrivateTradesNewItem = (state: RootState) => state.plugins.p2p.p2pMyNewItemTrades.data;
