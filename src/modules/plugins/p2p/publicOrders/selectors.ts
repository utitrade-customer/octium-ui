import { RootState } from 'modules';

export const selectOrderPublicLoading = (state: RootState) => state.plugins.p2p.p2pOrderPublic.loading;
export const selectOrderPublic = (state: RootState) => state.plugins.p2p.p2pOrderPublic.payload;
export const selectErrorOrderPublic = (state: RootState) => state.plugins.p2p.p2pOrderPublic.error;
