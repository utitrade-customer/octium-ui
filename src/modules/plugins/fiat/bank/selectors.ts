import { RootState } from '../../../index';

export const selectCreateBankAccountLoading = (state: RootState) => state.plugins.bank.createBankAccount.loading;

export const selectBankAccountList = (state: RootState) => state.plugins.bank.bankAccountList.payload;
export const selectBankAccountListLoading = (state: RootState) => state.plugins.bank.bankAccountList.loading;

export const selectDeleteBankAccountLoading = (state: RootState) => state.plugins.bank.deleteBankAccount.loading;

export const selectBankDepositHistoryList = (state: RootState) => state.plugins.bank.bankDepositHistoryList.payload;
export const selectBankDepositHistoryListLoading = (state: RootState) => state.plugins.bank.bankDepositHistoryList.loading;

export const selectCreateBankDepositLoading = (state: RootState) => state.plugins.bank.createBankDeposit.loading;

export const selectBankWithdrawHistoryList = (state: RootState) => state.plugins.bank.bankWithdrawHistoryList.payload;
export const selectBankWithdrawHistoryListLoading = (state: RootState) => state.plugins.bank.bankWithdrawHistoryList.loading;

export const selectCreateBankWithdrawLoading = (state: RootState) => state.plugins.bank.createBankWithdraw.loading;
