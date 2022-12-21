import _toUpper from 'lodash/toUpper';
import NP from 'number-precision';
import Tabs, { TabPane } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { setDocumentTitle } from '../../helpers';
import {
	allChildCurrenciesFetch,
	beneficiariesFetch,
	currenciesFetch,
	getKycStatus,
	infoSupportedFetch,
	selectWallets,
	walletsFetch,
} from '../../modules';
import { P2PWallet } from './P2PWallet';
import { SpotWallet } from './SpotWallet';
NP.enableBoundaryChecking(false); // default param is true

export interface WalletItem {
	key: string;
	address?: string;
	currency: string;
	name: string;
	balance?: string;
	locked?: string;
	type: 'fiat' | 'coin';
	fee: number;
	active?: boolean;
	fixed: number;
	iconUrl?: string;
}

export enum ENUM_WALLET {
	SPOT = 'spot',
	FUNDING = 'funding',
}

export const WalletListScreen = () => {
	const intl = useIntl();

	setDocumentTitle(intl.formatMessage({ id: 'page.body.wallets.setDocumentTitle' }));

	// state
	const [hideSmallBalanceState, setHideSmallBalanceState] = React.useState<boolean>(false);
	const [searchInputState, setSearchInputState] = React.useState('');
	const [activeWallet, setActiveWallet] = React.useState<ENUM_WALLET>(ENUM_WALLET.SPOT);

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchWallets = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);
	const dispatchcFetchCurrencies = React.useCallback(() => dispatch(currenciesFetch()), [dispatch]);
	const dispatchcFetchAllChildCurrencies = React.useCallback(() => dispatch(allChildCurrenciesFetch()), [dispatch]);
	const dispatchFetchBeneficiaries = React.useCallback(() => dispatch(beneficiariesFetch()), [dispatch]);

	// side effect
	React.useEffect(() => {
		dispatchFetchWallets();
		dispatchcFetchCurrencies();
		dispatchcFetchAllChildCurrencies();
		dispatchFetchBeneficiaries();
		dispatch(getKycStatus());
		dispatch(infoSupportedFetch());
	}, [dispatchFetchBeneficiaries, dispatchFetchWallets, dispatchcFetchCurrencies, dispatchcFetchAllChildCurrencies]);

	// selector
	const wallets = useSelector(selectWallets);

	const onChange = e => {
		setSearchInputState(_toUpper(e.target.value));
	};

	return (
		<div className="my-3 td-pg-wallets-screen">
			<div className="container-fluid">
				<div className="row td-pg-wallets-screen__header">
					<div className="col-12">
						<EstimatedValue wallets={wallets} activeTab={activeWallet} setActiveTab={setActiveWallet} />
					</div>
				</div>

				<div className="td-pg-wallets-screen__body" style={{ paddingBottom: '150px' }}>
					<div className="row">
						<div className="col-12 d-flex justify-content-between align-items-center flex-row">
							<div className="td-pg-wallets-screen__body__search-input">
								<input
									placeholder={intl.formatMessage({ id: 'page.body.wallets.search.placeholder' })}
									type="text"
									value={searchInputState}
									onChange={e => onChange(e)}
								/>
								<div className="icon-search">
									<svg
										width="18"
										height="18"
										viewBox="0 0 18 18"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
											fill="#848E9C"
										/>
									</svg>
								</div>
							</div>

							<div className="checkbox-input d-flex flex-row align-items-center">
								<span className="checkbox bounce mr-2">
									<input
										type="checkbox"
										checked={hideSmallBalanceState}
										onChange={e => setHideSmallBalanceState(e.target.checked)}
									/>
									<svg viewBox="0 0 21 21">
										<polyline points="5 10.75 8.5 14.25 16 6"></polyline>
									</svg>
								</span>
								<span className="text-white">
									{intl.formatMessage({ id: 'page.body.plugins.wallet.list.button.hideSmallBalance' })}
								</span>
							</div>
						</div>
					</div>
					<div className="row mt-3">
						<div className="col-12">
							{activeWallet === ENUM_WALLET.SPOT ? (
								<Tabs defaultActiveKey="Crypto">
									<TabPane tab={intl.formatMessage({ id: 'page.body.plugins.wallet.tab.crypto' })} key="Crypto">
										<div className="col-12">
											<SpotWallet
												isActiveWallet="Coin"
												hideSmallBalanceState={hideSmallBalanceState}
												searchInputState={searchInputState}
											/>
										</div>
									</TabPane>
									<TabPane tab={intl.formatMessage({ id: 'page.body.plugins.wallet.tab.fiat' })} key="Fiat">
										<div className="col-12">
											<SpotWallet
												isActiveWallet="Fiat"
												hideSmallBalanceState={hideSmallBalanceState}
												searchInputState={searchInputState}
											/>
										</div>
									</TabPane>
								</Tabs>
							) : (
								<>
									<Tabs defaultActiveKey="Crypto">
										<TabPane
											tab={intl.formatMessage({ id: 'page.body.plugins.wallet.tab.crypto' })}
											key="Crypto"
										>
											<div className="col-12">
												<P2PWallet
													isActiveWallet="Coin"
													hideSmallBalanceState={hideSmallBalanceState}
													searchInputState={searchInputState}
												/>
											</div>
										</TabPane>
									</Tabs>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
