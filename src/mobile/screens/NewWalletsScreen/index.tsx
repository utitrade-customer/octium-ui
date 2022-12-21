import { useDocumentTitle } from 'hooks';
import { EstimatedValue } from 'mobile/components/EstimatedValue';
import { getKycStatus, infoSupportedFetch } from 'modules';
import Tabs, { TabPane } from 'rc-tabs';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { ENUM_WALLET } from 'screens';
import { FundingWallet } from './FundingWallet';
import { SpotWallet } from './SpotWallet';

export const NewWalletsMobileScreen = () => {
	const intl = useIntl();
	const history = useHistory();
	const [activeWallet, setActiveWallet] = React.useState<ENUM_WALLET>(ENUM_WALLET.SPOT);
	useDocumentTitle(intl.formatMessage({ id: 'page.mobile.wallets.title' }));
	const dispatch = useDispatch();

	useEffect(() => {
		if (history.location.state && (history.location.state as { isFunding: boolean }).isFunding) {
			setActiveWallet(ENUM_WALLET.FUNDING);
		}
	}, [history.location.state]);

	useEffect(() => {
		dispatch(infoSupportedFetch());
		dispatch(getKycStatus());
	}, []);

	return (
		<div className="td-mobile-wallets">
			<EstimatedValue typeWallet={activeWallet} />

			<div>
				<div className="mt-3">
					<div className="col-12">
						<Tabs
							activeKey={activeWallet}
							onChange={(e: string) => {
								if (ENUM_WALLET.FUNDING === e || ENUM_WALLET.SPOT === e) {
									setActiveWallet(e);
								}
							}}
						>
							<TabPane tab="Spot" key={ENUM_WALLET.SPOT}>
								<SpotWallet />
							</TabPane>
							<TabPane tab="Funding" key={ENUM_WALLET.FUNDING}>
								<FundingWallet />
							</TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};
