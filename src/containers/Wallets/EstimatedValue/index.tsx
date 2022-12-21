import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { WalletItemProps } from '../../../components/WalletItem';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import { IntlProps } from '../../../index';
import {
	currenciesFetch,
	Currency,
	marketsFetch,
	marketsTickersFetch,
	RootState,
	selectCurrencies,
	selectMarkets,
	selectMarketTickers,
	selectUserLoggedIn,
} from '../../../modules';
import { Market, Ticker } from '../../../modules/public/markets';
import { rangerConnectFetch, RangerConnectFetch } from '../../../modules/public/ranger';
import { RangerState } from '../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../modules/public/ranger/selectors';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import { CurrencyIcon } from 'components/CurrencyIcon';
import Tabs, { TabPane } from 'rc-tabs';
import { ENUM_WALLET } from 'screens';
import { EstimatedP2pValue } from './EstimatedP2pValue';

interface EstimatedValueProps {
	wallets: WalletItemProps[];
	hello: string;
	activeTab: ENUM_WALLET;
	setActiveTab: (activeTab: ENUM_WALLET) => void;
}

interface ReduxProps {
	currencies: Currency[];
	markets: Market[];
	tickers: {
		[key: string]: Ticker;
	};
	rangerState: RangerState;
	userLoggedIn: boolean;
}

interface DispatchProps {
	fetchCurrencies: typeof currenciesFetch;
	fetchMarkets: typeof marketsFetch;
	fetchTickers: typeof marketsTickersFetch;
	rangerConnect: typeof rangerConnectFetch;
}

type Props = DispatchProps & ReduxProps & EstimatedValueProps & IntlProps;

class EstimatedValueContainer extends React.Component<Props> {
	public onChangeTab = (activeTabValue: ENUM_WALLET) => {
		this.props.setActiveTab(activeTabValue);
	};

	public componentDidMount(): void {
		const {
			currencies,
			fetchCurrencies,
			fetchMarkets,
			fetchTickers,
			markets,
			rangerState: { connected },
			userLoggedIn,
		} = this.props;

		if (markets.length === 0) {
			fetchMarkets();
			fetchTickers();
		}

		if (currencies.length === 0) {
			fetchCurrencies();
		}

		if (!connected) {
			this.props.rangerConnect({ withAuth: userLoggedIn });
		}
	}

	public componentWillReceiveProps(next: Props) {
		const { currencies, fetchCurrencies, fetchMarkets, fetchTickers, markets } = this.props;

		if (next.markets.length === 0 && next.markets !== markets) {
			fetchMarkets();
			fetchTickers();
		}

		if (next.currencies.length === 0 && next.currencies !== currencies) {
			fetchCurrencies();
		}
	}

	// method

	public render(): React.ReactNode {
		const { currencies, markets, tickers, wallets } = this.props;
		const estimatedValue = estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
		const currency = currencies.find((currency: Currency) => currency.id === _toLower(VALUATION_PRIMARY_CURRENCY)) || {
			name: '',
		};
		return (
			<div className="pg-estimated-value">
				<div className="pg-estimated-value__container">
					<div className="text-dark ml-3">{this.translate('page.body.wallets.estimated_value')}</div>
					<div className="mt-3 d-flex flex-row">
						{this.props.activeTab === ENUM_WALLET.SPOT ? (
							<>
								<div className="value-container d-flex flex-row align-items-center">
									<div>
										<CurrencyIcon
											style={{ borderRadius: '50%' }}
											width="50px"
											height="50px"
											currency_id={VALUATION_PRIMARY_CURRENCY}
											alt={VALUATION_PRIMARY_CURRENCY}
										/>
									</div>
									<div className="ml-3">
										<div>{currency?.name}</div>
										<div>
											<span className="value">{estimatedValue}</span>
											<span className="value-sign ml-3">{_toUpper(VALUATION_PRIMARY_CURRENCY)}</span>
										</div>
									</div>
								</div>
								{VALUATION_SECONDARY_CURRENCY && this.renderSecondaryCurrencyValuation(estimatedValue)}
							</>
						) : (
							<EstimatedP2pValue currencies={currencies} />
						)}
					</div>
					<div>
						<div className="row mt-3">
							<div className="col-12">
								<Tabs
									activeKey={this.props.activeTab}
									onChange={(e: string) => {
										if (ENUM_WALLET.FUNDING === e || ENUM_WALLET.SPOT === e) {
											this.onChangeTab(e);
										}
									}}
								>
									<TabPane tab="Spot" key={ENUM_WALLET.SPOT}></TabPane>
									<TabPane tab="Funding" key={ENUM_WALLET.FUNDING}></TabPane>
								</Tabs>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	public translate = (key: string) => this.props.intl.formatMessage({ id: key });

	private renderSecondaryCurrencyValuation = (estimatedValue: string) => {
		const { currencies, markets, tickers } = this.props;
		const estimatedValueSecondary = estimateUnitValue(
			VALUATION_SECONDARY_CURRENCY,
			VALUATION_PRIMARY_CURRENCY,
			+estimatedValue,
			currencies,
			markets,
			tickers,
		);
		const currency = currencies.find((currency: Currency) => currency.id === _toLower(VALUATION_SECONDARY_CURRENCY)) || {
			name: '',
		};
		return (
			<div className="value-container d-flex flex-row align-items-center">
				<div>
					<CurrencyIcon
						width="50px"
						height="50px"
						currency_id={VALUATION_SECONDARY_CURRENCY}
						alt={VALUATION_SECONDARY_CURRENCY}
					/>
				</div>
				<div className="ml-3">
					<div>{currency?.name}</div>
					<div>
						<span className="value">{estimatedValueSecondary}</span>
						<span className="value-sign ml-3">{_toUpper(VALUATION_SECONDARY_CURRENCY)}</span>
					</div>
				</div>
			</div>
		);
	};
}

const mapStateToProps = (state: RootState): ReduxProps => ({
	currencies: selectCurrencies(state),
	markets: selectMarkets(state),
	tickers: selectMarketTickers(state),
	rangerState: selectRanger(state),
	userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	fetchCurrencies: () => dispatch(currenciesFetch()),
	fetchMarkets: () => dispatch(marketsFetch()),
	fetchTickers: () => dispatch(marketsTickersFetch()),
	rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const EstimatedValue = injectIntl(connect(mapStateToProps, mapDispatchToProps)(EstimatedValueContainer)) as any;
