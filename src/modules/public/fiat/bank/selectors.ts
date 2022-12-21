import { RootState } from '../../../index';

export const selectPublicBankList = (state: RootState) => state.public.bank.payload;
export const selectPublicBankListLoading = (state: RootState) => state.public.bank.loading;
