import { combineReducers } from 'redux';
import { ethFeeReducer } from './plugins/ethWithdraw/fee';
import { eventReducer } from './plugins/info/events';
import { airdropCoinClaimReducer, airdropCoinListReducer } from './plugins/airdropCoin';
import {
	BuyersHistoryReducer,
	BuyHistoryReducer,
	buyIEOReducer,
	IEODetailReducer,
	IEOItemReducer,
	IEOListReducer,
	priceReducer,
	totalIEOBuyersReducer,
} from './plugins/ieo';
import { IEOCautionReducer } from './plugins/ieo/caution';
import {
	createStakeReducer,
	stakeHistoryReducer,
	stakeWalletReducer,
	stakingListReducer,
	unStakeHistoryReducer,
	unStakeReducer,
} from './plugins/staking';
import { voteDonateReducer, voteHistoryReducer, voteListReducer } from './plugins/vote';
import { alertReducer } from './public/alert';
import { blocklistAccessReducer } from './public/blocklistAccess';
import { configsReducer } from './public/configs';
import { currenciesReducer } from './public/currencies';
import { customizationReducer } from './public/customization';
import { changeColorThemeReducer } from './public/globalSettings';
import { gridLayoutReducer } from './public/gridLayout/reducer';
import { changeLanguageReducer } from './public/i18n';
import { klineReducer } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import { depthReducer, incrementDepthReducer, orderBookReducer } from './public/orderBook';
import { rangerReducer } from './public/ranger/reducer';
import { recentTradesReducer } from './public/recentTrades';
import { apiKeysReducer } from './user/apiKeys';
import { authReducer } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { customizationUpdateReducer } from './user/customization';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { depositHistoryReducer, historyReducer, withdrawHistoryReducer } from './user/history';
import { addressesReducer, documentsReducer, identityReducer, labelReducer, phoneReducer } from './user/kyc';
import { newHistoryReducer } from './user/newHistory';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer } from './user/orders';
import { ordersHistoryReducer } from './user/ordersHistory';
import { passwordReducer } from './user/password';
import { profileReducer } from './user/profile';
import { userActivityReducer } from './user/userActivity';
import { allChildCurrenciesReducer, childCurrenciesReducer, walletsReducer, walletsWithdrawLimitReducer } from './user/wallets';
import { withdrawLimitReducer } from './user/withdrawLimit';
import {
	friendsListReducer,
	commsionHistoryReducer,
	referralRanksReducer,
	estimatedCommisionReducer,
	commisionInfoReducer,
} from './plugins/referral';
import {
	CompetitionListReducer,
	CompetitionItemReducer,
	CompetitionVolumeReducer,
	rankingCompetitionReducer,
	competitionAwardReducer,
} from './plugins/competition';
import { transactionListReducer, transactionPriceListReducer } from './plugins/transactions';
import { statisticReducer } from './plugins/info/statistic';
import { verifyAccountReducer } from './plugins/kyc';
import { kycStatusReducer } from './plugins/kyc';
import {
	AnnouncementsReducer,
	AnnouncementDetailReducer,
	CategoriesReducer,
	AnnouncementListReducer,
} from './plugins/Announcements';
import { withdrawLimitCheckingReducer, withdrawLimitRemainReducer, withdrawLimitFeeReducer } from './user/newWithdrawLimit';
import { paypalDepositReducer, paypalRecentDepositReducer, paypalDepositHistoryReducer } from './plugins/fiat/paypal';
import { paypalWithdrawHistoryReducer } from './plugins/fiat/paypal/reducers/withdraw';
import {
	bankAccountListReducer,
	createBankAccountReducer,
	deleteBankAccountReducer,
} from './plugins/fiat/bank/reducers/bankAccount';
import { bankDepositHistoryListReducer, createBankDepositReducer } from './plugins/fiat/bank/reducers/bankDeposit';
import { bankWithdrawHistoryListReducer, createBankWithdrawReducer } from './plugins/fiat/bank/reducers/bankWithdraw';
import { bankListReducer } from './public/fiat/bank/reducers';
import { paymentMethodsReducer } from './plugins/p2p/payments';
import { p2pOrdersPrivateFindItemReducer, p2pOrdersPrivateReducer } from './plugins/p2p/orders';
import {
	p2pBalancesReducer,
	p2pFindBalanceTokenReducer,
	p2pHistoryBalancesReducer,
	p2pValueBalancesReducer,
} from './plugins/p2p/balances';
import { p2pPublicOrderReducer } from './plugins/p2p/publicOrders';
import { p2pPublicInfosSupportedReducer, p2pPublicPriceSupportedReducer } from './plugins/p2p/publicInfo';
import { p2pPrivateInfoUserReducer, p2pPublicInfoUserReducer } from './plugins/p2p/infoUser';
import { p2pInfoTradesReducer } from './plugins/p2p/trades';
import { createP2PReportReducer, p2pReportsReducer } from './plugins/p2p/reports';
import { p2pFeedbacksReducer } from './plugins/p2p/feedbacks';
import { p2pPrivateTradeItemNewReducer, p2pPrivateTradesReducer } from './plugins/p2p/myTrades';

const ethFeesReducer = combineReducers({
	ethFee: ethFeeReducer,
});

const IEOReducer = combineReducers({
	IEOItem: IEOItemReducer,
	IEOList: IEOListReducer,
	buyIEO: buyIEOReducer,
	buyHistory: BuyHistoryReducer,
	buyersHistory: BuyersHistoryReducer,
	totalIEOBuyers: totalIEOBuyersReducer,
	ieoDetail: IEODetailReducer,
	ieoCaution: IEOCautionReducer,
	price: priceReducer,
});

export const newWithdrawLimitReducer = combineReducers({
	remains: withdrawLimitRemainReducer,
	checking: withdrawLimitCheckingReducer,
	fee: withdrawLimitFeeReducer,
});
export const competitionReducer = combineReducers({
	competitionList: CompetitionListReducer,
	competitionItem: CompetitionItemReducer,
	competitionVolume: CompetitionVolumeReducer,
	competitionRanking: rankingCompetitionReducer,
	competitionAward: competitionAwardReducer,
});

const infoReducer = combineReducers({
	events: eventReducer,
	statistic: statisticReducer,
});

export const publicReducer = combineReducers({
	blocklistAccess: blocklistAccessReducer,
	colorTheme: changeColorThemeReducer,
	configs: configsReducer,
	currencies: currenciesReducer,
	customization: customizationReducer,
	recentTrades: recentTradesReducer,
	markets: marketsReducer,
	orderBook: orderBookReducer,
	depth: depthReducer,
	incrementDepth: incrementDepthReducer,
	ranger: rangerReducer,
	i18n: changeLanguageReducer,
	kline: klineReducer,
	alerts: alertReducer,
	rgl: gridLayoutReducer,
	memberLevels: memberLevelsReducer,
	bank: bankListReducer,
});

export const userReducer = combineReducers({
	auth: authReducer,
	beneficiaries: beneficiariesReducer,
	customizationUpdate: customizationUpdateReducer,
	label: labelReducer,
	orders: ordersReducer,
	password: passwordReducer,
	profile: profileReducer,
	wallets: walletsReducer,
	childCurrencies: childCurrenciesReducer,
	allChildCurrencies: allChildCurrenciesReducer,
	addresses: addressesReducer,
	documents: documentsReducer,
	identity: identityReducer,
	phone: phoneReducer,
	history: historyReducer,
	withdrawHistory: withdrawHistoryReducer,
	depositHistory: depositHistoryReducer,
	newHistory: newHistoryReducer,
	apiKeys: apiKeysReducer,
	userActivity: userActivityReducer,
	ordersHistory: ordersHistoryReducer,
	openOrders: openOrdersReducer,
	sendEmailVerification: sendEmailVerificationReducer,
	captchaKeys: getGeetestCaptchaReducer,
	withdrawLimit: withdrawLimitReducer,
	walletsWithdrawLimit: walletsWithdrawLimitReducer,
	newWithdrawLimit: newWithdrawLimitReducer,
});

const voteReducer = combineReducers({
	list: voteListReducer,
	history: voteHistoryReducer,
	donate: voteDonateReducer,
});

const airdropCoinReducer = combineReducers({
	list: airdropCoinListReducer,
	claims: airdropCoinClaimReducer,
});

const stakeReducer = combineReducers({
	stakeList: stakingListReducer,
	stakeWallet: stakeWalletReducer,
	stakeHistory: stakeHistoryReducer,
	createStake: createStakeReducer,
	unstake: unStakeReducer,
	unstakeHistory: unStakeHistoryReducer,
});

const referralReducer = combineReducers({
	friends: friendsListReducer,
	history: commsionHistoryReducer,
	ranks: referralRanksReducer,
	estimatedCommision: estimatedCommisionReducer,
	commisionInfo: commisionInfoReducer,
});

const transactionsReducer = combineReducers({
	prices: transactionPriceListReducer,
	list: transactionListReducer,
});

const kycReducer = combineReducers({
	verifyAccount: verifyAccountReducer,
	kycStatus: kycStatusReducer,
});
const paypalReducer = combineReducers({
	createDeposit: paypalDepositReducer,
	recentDeposit: paypalRecentDepositReducer,
	depositHistory: paypalDepositHistoryReducer,
	withdrawHistory: paypalWithdrawHistoryReducer,
});

const bankReducer = combineReducers({
	createBankAccount: createBankAccountReducer,
	bankAccountList: bankAccountListReducer,
	deleteBankAccount: deleteBankAccountReducer,
	bankDepositHistoryList: bankDepositHistoryListReducer,
	createBankDeposit: createBankDepositReducer,
	bankWithdrawHistoryList: bankWithdrawHistoryListReducer,
	createBankWithdraw: createBankWithdrawReducer,
});

const announcementReducer = combineReducers({
	announcements: AnnouncementsReducer,
	announcementItem: AnnouncementDetailReducer,
	categories: CategoriesReducer,
	announcementList: AnnouncementListReducer,
});

const p2pReducer = combineReducers({
	paymentMethods: paymentMethodsReducer,
	orderPrivate: p2pOrdersPrivateReducer,
	itemOrderPrivate: p2pOrdersPrivateFindItemReducer,
	balances: p2pBalancesReducer,
	historyBalances: p2pHistoryBalancesReducer,
	valueBalances: p2pValueBalancesReducer,
	findBalanceToken: p2pFindBalanceTokenReducer,
	infoOrderPublic: p2pPublicInfosSupportedReducer,
	priceInfoOrderPublic: p2pPublicPriceSupportedReducer,
	p2pOrderPublic: p2pPublicOrderReducer,
	p2pInfoUserPublic: p2pPublicInfoUserReducer,
	p2pInfoUserPrivate: p2pPrivateInfoUserReducer,
	p2pTrades: p2pInfoTradesReducer,
	p2pReports: p2pReportsReducer,
	createP2PReport: createP2PReportReducer,
	p2pFeedbacks: p2pFeedbacksReducer,
	p2pMyTrades: p2pPrivateTradesReducer,
	p2pMyNewItemTrades: p2pPrivateTradeItemNewReducer,
});

export const pluginsReducer = combineReducers({
	vote: voteReducer,
	stake: stakeReducer,
	ieo: IEOReducer,
	ethFee: ethFeesReducer,
	info: infoReducer,
	airdropCoin: airdropCoinReducer,
	referral: referralReducer,
	competition: competitionReducer,
	transactions: transactionsReducer,
	kyc: kycReducer,
	announcements: announcementReducer,
	paypal: paypalReducer,
	bank: bankReducer,
	p2p: p2pReducer,
});
