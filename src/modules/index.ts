import { combineReducers } from 'redux';
import { all, call } from 'redux-saga/effects';
import { pluginsReducer, publicReducer, userReducer } from './app';
import { ETHFeeState, rootETHFeeSaga } from './plugins/ethWithdraw/fee';
import { EventsState, rootEventSaga } from './plugins/info/events';
import { AirdropCoinClaimState, AirdropCoinState, rootAirdropCoinSaga } from './plugins/airdropCoin';
import {
	BuyIEOLoadingState,
	rootBuyIEOSaga,
	TotalIEOBuyersState,
	IEOItemState,
	rootIEOItemSaga,
	IEOListState,
	rootIEOListSaga,
	rootPriceSaga,
	PriceState,
} from './plugins/ieo';
import { IEOCautionState, rootIEOCautionSaga } from './plugins/ieo/caution';
import { DetailIEOState, rootIEODetailSaga } from './plugins/ieo/detail';
import { BuyersHistoryState, BuyHistoryListState, rootHistoryBuySaga } from './plugins/ieo/history';
import {
	CreateStakeState,
	rootStakingSaga,
	StakeHistoryState,
	StakeWalletState,
	StakingListState,
	UnStakeHistoryState,
	UnstakeState,
} from './plugins/staking';
import { rootVoteSaga, VoteDonateState, VoteHistoryState, VoteListState } from './plugins/vote';
import { AlertState, rootHandleAlertSaga } from './public/alert';
import { BlocklistAccessState, rootBlocklistAccessSaga } from './public/blocklistAccess';
import { ConfigsState, rootConfigsSaga } from './public/configs';
import { CurrenciesState, rootCurrenciesSaga } from './public/currencies';
import { CustomizationState, rootCustomizationSaga } from './public/customization';
import { ColorThemeState } from './public/globalSettings';
import { GridLayoutState } from './public/gridLayout';
import { LanguageState } from './public/i18n';
import { KlineState, rootKlineFetchSaga } from './public/kline';
import { MarketsState, rootMarketsSaga } from './public/markets';
import { MemberLevelsState, rootMemberLevelsSaga } from './public/memberLevels';
import { DepthIncrementState, DepthState, OrderBookState, rootOrderBookSaga } from './public/orderBook';
import { RangerState } from './public/ranger/reducer';
import { RecentTradesState, rootRecentTradesSaga } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { rootApiKeysSaga } from './user/apiKeys/sagas';
import { AuthState, rootAuthSaga } from './user/auth';
import { BeneficiariesState, rootBeneficiariesSaga } from './user/beneficiaries';
import { GeetestCaptchaState, rootGeetestCaptchaSaga } from './user/captcha';
import { CustomizationUpdateState, rootCustomizationUpdateSaga } from './user/customization';
import { EmailVerificationState, rootEmailVerificationSaga } from './user/emailVerification';
import { DepositHistoryState, HistoryState, rootHistorySaga, WithdrawHistoryState } from './user/history';
import { AddressesState, rootSendAddressesSaga } from './user/kyc/addresses';
import { DocumentsState, rootSendDocumentsSaga } from './user/kyc/documents';
import { IdentityState, rootSendIdentitySaga } from './user/kyc/identity';
import { LabelState, rootLabelSaga } from './user/kyc/label';
import { PhoneState, rootSendCodeSaga } from './user/kyc/phone';
import { NewHistoryState, rootNewHistorySaga } from './user/newHistory';
import { OpenOrdersState, rootOpenOrdersSaga } from './user/openOrders';
import { OrdersState, rootOrdersSaga } from './user/orders';
import { OrdersHistoryState, rootOrdersHistorySaga } from './user/ordersHistory';
import { PasswordState, rootPasswordSaga } from './user/password';
import { ProfileState, rootProfileSaga } from './user/profile';
import { rootUserActivitySaga, UserActivityState } from './user/userActivity';
import { ChildCurrenciesState, rootWalletsSaga, WalletsState, WalletsWithdrawLimitState } from './user/wallets';
import { rootWithdrawLimitSaga, WithdrawLimitState } from './user/withdrawLimit';
import {
	CommisionHistoryState,
	CommisionInfoState,
	EstimatedCommisionState,
	FriendsListState,
	ReferralRankState,
	rootReferralSaga,
} from './plugins/referral';
import {
	CompetitionAwardState,
	CompetitionVolumeState,
	ListCompetitionState,
	NewCompetitionState,
	RankingCompetitionState,
	rootCompetitionAwardSaga,
	rootCompetitionItemSaga,
	rootCompetitionVolumeSaga,
	rootCompetitionRankingSaga,
	rootCompetitionListSaga,
} from './plugins/competition/';
import { rootTransactionSaga, TransactionPriceListState, TransactionsListState } from './plugins/transactions';
import { rootStatisticSaga, StatisticState } from './plugins/info/statistic';
import { VerifyAccountState, rootKycSaga, KycStatusState } from './plugins/kyc';
import {
	AnnouncementsState,
	AnnouncementDetailState,
	CategoriesState,
	AnnouncementListState,
	rootAnnouncementSaga,
} from './plugins/Announcements';
import {
	NewWithdrawLimitCheckingState,
	NewWithdrawLimitRemainsState,
	rootNewWithdrawLimitSaga,
	WithdrawLimitFeeState,
} from './user/newWithdrawLimit';
import {
	PaypalDepositState,
	PaypalRecentDepositState,
	PaypalDepositHistoryState,
	PaypalWithdrawHistoryState,
	rootPaypalSaga,
} from './plugins/fiat/paypal';
import {
	BankAccountListState,
	BankDepositHistoryListState,
	BankWithdrawHistoryListState,
	CreateBankAccountState,
	CreateBankDepositState,
	CreateBankWithdrawState,
	DeleteBankAccountState,
} from './plugins/fiat/bank/types';
import { rootBankSaga } from './plugins/fiat/bank/sagas';
import { rootPublicBankListSaga } from './public/fiat/bank/sagas';
import { BankListState } from './public/fiat/bank/types';
import { PaymentMethodsState, rootPaymentSaga } from './plugins/p2p/payments';
import { P2pOrdersPrivateState, P2pOrdersPrivateStateFindItemState, rootP2POrdersSaga } from './plugins/p2p/orders';
import { rootP2PBalancesSaga, BalancesState, HistoryBalancesState, FindBalanceTokenState } from './plugins/p2p/balances';
import { P2pPublicOrdersState, rootP2PPublicOrdersSaga } from './plugins/p2p/publicOrders';
import { InfoPriceSupportedState, InfoSupportedState, rootP2PPublicInfosSaga } from './plugins/p2p/publicInfo';
import { P2pPrivateInfoUserState, P2pPublicInfoUserState, rootP2PInfoUserSaga } from './plugins/p2p/infoUser';
import { P2pInfoTradesState, rootP2PTradesSaga } from './plugins/p2p/trades';
import { P2pFeedbacksState, rootP2PFeedbacksSaga } from './plugins/p2p/feedbacks';
import { P2pReportsState, rootP2PReportsSaga } from './plugins/p2p/reports';
import { IP2pPrivateTradeItemNewState, IP2pPrivateTradesState, rootP2PPrivateTradesSaga } from './plugins/p2p/myTrades';
import { CreateReportState } from './plugins/p2p/reports';

export * from './plugins/ethWithdraw/fee';
export * from './plugins/info/events';
export * from './plugins/airdropCoin';
export * from './plugins/ieo';
export * from './plugins/staking';
export * from './plugins/vote';
export * from './public/alert';
export * from './public/blocklistAccess';
export * from './public/configs';
export * from './public/currencies';
export * from './public/customization';
export * from './public/globalSettings';
export * from './public/i18n';
export * from './public/kline';
export * from './public/markets';
export * from './public/memberLevels';
export * from './public/orderBook';
export * from './plugins/competition';
export * from './plugins/p2p/payments';
export * from './plugins/p2p/orders';
export * from './plugins/p2p/balances';
export * from './plugins/p2p/publicOrders';
export * from './plugins/p2p/publicInfo';
export * from './plugins/p2p/infoUser';
export * from './plugins/p2p/trades';
export * from './plugins/p2p/reports';
export * from './plugins/p2p/feedbacks';
export * from './plugins/p2p/myTrades';

export * from './user/apiKeys';
export * from './user/auth';
export * from './user/beneficiaries';
export * from './user/captcha';
export * from './user/customization';
export * from './user/emailVerification';
export * from './user/history';
export * from './user/kyc';
export * from './user/newHistory';
export * from './user/openOrders';
export * from './user/orders';
export * from './user/ordersHistory';
export * from './user/password';
export * from './user/profile';
export * from './user/userActivity';
export * from './user/wallets';
export * from './plugins/kyc';
export * from './plugins/Announcements';
export * from './user/newWithdrawLimit';

export interface RootState {
	public: {
		alerts: AlertState;
		blocklistAccess: BlocklistAccessState;
		colorTheme: ColorThemeState;
		configs: ConfigsState;
		currencies: CurrenciesState;
		customization: CustomizationState;
		rgl: GridLayoutState;
		i18n: LanguageState;
		kline: KlineState;
		markets: MarketsState;
		memberLevels: MemberLevelsState;
		orderBook: OrderBookState;
		ranger: RangerState;
		recentTrades: RecentTradesState;
		depth: DepthState;
		incrementDepth: DepthIncrementState;
		bank: BankListState;
	};
	user: {
		apiKeys: ApiKeysState;
		auth: AuthState;
		beneficiaries: BeneficiariesState;
		captchaKeys: GeetestCaptchaState;
		customizationUpdate: CustomizationUpdateState;
		sendEmailVerification: EmailVerificationState;
		history: HistoryState;
		withdrawHistory: WithdrawHistoryState;
		depositHistory: DepositHistoryState;
		documents: DocumentsState;
		addresses: AddressesState;
		identity: IdentityState;
		label: LabelState;
		phone: PhoneState;
		newHistory: NewHistoryState;
		openOrders: OpenOrdersState;
		orders: OrdersState;
		ordersHistory: OrdersHistoryState;
		password: PasswordState;
		profile: ProfileState;
		userActivity: UserActivityState;
		wallets: WalletsState;
		childCurrencies: ChildCurrenciesState;
		allChildCurrencies: ChildCurrenciesState;
		withdrawLimit: WithdrawLimitState;
		walletsWithdrawLimit: WalletsWithdrawLimitState;
		newWithdrawLimit: {
			remains: NewWithdrawLimitRemainsState;
			checking: NewWithdrawLimitCheckingState;
			fee: WithdrawLimitFeeState;
		};
	};
	plugins: {
		stake: {
			createStake: CreateStakeState;
			unstake: UnstakeState;
			stakeList: StakingListState;
			stakeWallet: StakeWalletState;
			stakeHistory: StakeHistoryState;
			unstakeHistory: UnStakeHistoryState;
		};
		vote: {
			list: VoteListState;
			history: VoteHistoryState;
			donate: VoteDonateState;
		};
		airdropCoin: {
			list: AirdropCoinState;
			claims: AirdropCoinClaimState;
		};
		ieo: {
			price: PriceState;
			IEOItem: IEOItemState;
			IEOList: IEOListState;
			buyIEO: BuyIEOLoadingState;
			totalIEOBuyers: TotalIEOBuyersState;
			buyersHistory: BuyersHistoryState;
			buyHistory: BuyHistoryListState;
			ieoDetail: DetailIEOState;
			ieoCaution: IEOCautionState;
		};
		ethFee: {
			ethFee: ETHFeeState;
		};
		info: {
			events: EventsState;
			statistic: StatisticState;
		};
		referral: {
			friends: FriendsListState;
			history: CommisionHistoryState;
			ranks: ReferralRankState;
			estimatedCommision: EstimatedCommisionState;
			commisionInfo: CommisionInfoState;
		};
		competition: {
			competitionList: ListCompetitionState;
			competitionItem: NewCompetitionState;
			competitionVolume: CompetitionVolumeState;
			competitionRanking: RankingCompetitionState;
			competitionAward: CompetitionAwardState;
		};
		transactions: {
			prices: TransactionPriceListState;
			list: TransactionsListState;
		};
		kyc: {
			verifyAccount: VerifyAccountState;
			kycStatus: KycStatusState;
		};
		announcements: {
			announcements: AnnouncementsState;
			announcementItem: AnnouncementDetailState;
			categories: CategoriesState;
			announcementList: AnnouncementListState;
		};
		paypal: {
			createDeposit: PaypalDepositState;
			recentDeposit: PaypalRecentDepositState;
			depositHistory: PaypalDepositHistoryState;
			withdrawHistory: PaypalWithdrawHistoryState;
		};
		bank: {
			bankAccountList: BankAccountListState;
			createBankAccount: CreateBankAccountState;
			deleteBankAccount: DeleteBankAccountState;
			bankDepositHistoryList: BankDepositHistoryListState;
			createBankDeposit: CreateBankDepositState;
			bankWithdrawHistoryList: BankWithdrawHistoryListState;
			createBankWithdraw: CreateBankWithdrawState;
		};
		p2p: {
			paymentMethods: PaymentMethodsState;
			orderPrivate: P2pOrdersPrivateState;
			itemOrderPrivate: P2pOrdersPrivateStateFindItemState;
			balances: BalancesState;
			historyBalances: HistoryBalancesState;
			valueBalances: BalancesState;
			findBalanceToken: FindBalanceTokenState;
			infoOrderPublic: InfoSupportedState;
			priceInfoOrderPublic: InfoPriceSupportedState;
			p2pOrderPublic: P2pPublicOrdersState;
			p2pInfoUserPublic: P2pPublicInfoUserState;
			p2pInfoUserPrivate: P2pPrivateInfoUserState;
			p2pTrades: P2pInfoTradesState;
			p2pFeedbacks: P2pFeedbacksState;
			p2pReports: P2pReportsState;
			createP2PReport: CreateReportState;
			p2pMyTrades: IP2pPrivateTradesState;
			p2pMyNewItemTrades: IP2pPrivateTradeItemNewState;
		};
	};
}

export const rootReducer = combineReducers({
	public: publicReducer,
	user: userReducer,
	plugins: pluginsReducer,
});

export function* rootSaga() {
	yield all([
		call(rootApiKeysSaga),
		call(rootAuthSaga),
		call(rootBeneficiariesSaga),
		call(rootBlocklistAccessSaga),
		call(rootConfigsSaga),
		call(rootCurrenciesSaga),
		call(rootCustomizationSaga),
		call(rootCustomizationUpdateSaga),
		call(rootEmailVerificationSaga),
		call(rootGeetestCaptchaSaga),
		call(rootHandleAlertSaga),
		call(rootHistorySaga),
		call(rootKlineFetchSaga),
		call(rootLabelSaga),
		call(rootMarketsSaga),
		call(rootMemberLevelsSaga),
		call(rootNewHistorySaga),
		call(rootOpenOrdersSaga),
		call(rootOrderBookSaga),
		call(rootOrdersHistorySaga),
		call(rootOrdersSaga),
		call(rootPasswordSaga),
		call(rootProfileSaga),
		call(rootRecentTradesSaga),
		call(rootSendCodeSaga),
		call(rootSendAddressesSaga),
		call(rootSendDocumentsSaga),
		call(rootSendIdentitySaga),
		call(rootUserActivitySaga),
		call(rootWalletsSaga),
		call(rootWithdrawLimitSaga),
		call(rootETHFeeSaga),
		call(rootIEOItemSaga),
		call(rootIEOListSaga),
		call(rootBuyIEOSaga),
		call(rootHistoryBuySaga),
		call(rootIEODetailSaga),
		call(rootPriceSaga),
		call(rootIEOCautionSaga),
		call(rootCompetitionAwardSaga),
		call(rootCompetitionItemSaga),
		call(rootCompetitionVolumeSaga),
		call(rootCompetitionRankingSaga),
		call(rootCompetitionListSaga),
		call(rootEventSaga),
		call(rootStakingSaga),
		call(rootVoteSaga),
		call(rootAirdropCoinSaga),
		call(rootReferralSaga),
		call(rootTransactionSaga),
		call(rootStatisticSaga),
		call(rootKycSaga),
		call(rootAnnouncementSaga),
		call(rootPaypalSaga),
		call(rootBankSaga),
		call(rootPublicBankListSaga),
		call(rootNewWithdrawLimitSaga),
		call(rootPaymentSaga),
		call(rootP2POrdersSaga),
		call(rootP2PBalancesSaga),
		call(rootP2PPublicOrdersSaga),
		call(rootP2PPublicInfosSaga),
		call(rootP2PInfoUserSaga),
		call(rootP2PPublicInfosSaga),
		call(rootP2PTradesSaga),
		call(rootP2PFeedbacksSaga),
		call(rootP2PReportsSaga),
		call(rootP2PPrivateTradesSaga),
	]);
}
