import { RootState } from 'modules';

export const selectInfoUserPublicLoading = (state: RootState) => state.plugins.p2p.p2pInfoUserPublic.loading;
export const selectInfoUserErrPublic = (state: RootState) => state.plugins.p2p.p2pInfoUserPublic.error;
export const selectInfoUserPublic = (state: RootState) => state.plugins.p2p.p2pInfoUserPublic.payload;

export const selectInfoUserPrivateLoading = (state: RootState) => state.plugins.p2p.p2pInfoUserPrivate.loading;
export const selectInfoUserErrPrivate = (state: RootState) => state.plugins.p2p.p2pInfoUserPrivate.error;
export const selectInfoUserPrivate = (state: RootState) => state.plugins.p2p.p2pInfoUserPrivate.payload;
