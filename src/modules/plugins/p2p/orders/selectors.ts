import { RootState } from 'modules';

export const selectPrivateOrdersCRUDLoading = (state: RootState) => state.plugins.p2p.orderPrivate.isLoadingCRUD;
export const selectPrivateOrdersLoading = (state: RootState) => state.plugins.p2p.orderPrivate.loading;
export const selectPrivateOrders = (state: RootState) => state.plugins.p2p.orderPrivate.payload;

export const selectPrivateInfoItemOrders = (state: RootState) => state.plugins.p2p.itemOrderPrivate;
