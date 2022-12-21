import { RootState } from 'modules';

export const selectPaymentMethodsLoading = (state: RootState) => state.plugins.p2p.paymentMethods.loading;
export const selectPaymentMethods = (state: RootState) => state.plugins.p2p.paymentMethods.payload;

export const selectPaymentMethodsChangeLoading = (state: RootState) => state.plugins.p2p.paymentMethods.isLoadingCRUD;
