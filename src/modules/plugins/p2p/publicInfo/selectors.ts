import { RootState } from 'modules';

export const selectPublicInfosP2pLoading = (state: RootState) => state.plugins.p2p.infoOrderPublic.loading;
export const selectPublicInfosP2p = (state: RootState) => state.plugins.p2p.infoOrderPublic.payload;

export const selectPublicInfoPriceP2pLoading = (state: RootState) => state.plugins.p2p.priceInfoOrderPublic.loading;
export const selectPublicInfoPriceP2p = (state: RootState) => state.plugins.p2p.priceInfoOrderPublic.payload;
