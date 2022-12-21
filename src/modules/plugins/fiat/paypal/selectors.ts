import { RootState } from '../../../index';

export const selectPaypalDepositData = (state: RootState) => state.plugins.paypal.createDeposit.payload;
export const selectPaypalRecentDepositData = (state: RootState) => state.plugins.paypal.recentDeposit.payload;
export const selectPaypalDepositHistoryData = (state: RootState) => state.plugins.paypal.depositHistory.payload;
export const selectPaypalWithdrawHistoryData = (state: RootState) => state.plugins.paypal.withdrawHistory.payload;
