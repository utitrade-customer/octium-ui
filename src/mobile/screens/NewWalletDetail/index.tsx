import { ConvertUsd } from 'components';
import { calcWalletsData } from 'helpers';
import {
	useAllChildCurrenciesFetch,
	useDocumentTitle,
	useMarketsFetch,
	useMarketsTickersFetch,
	useRangerConnectFetch,
	useWalletsFetch,
} from 'hooks';
import _toNumber from 'lodash/toNumber';
import { GoBackIcon } from 'mobile/assets/icons';
import { MarketList } from 'mobile/components';
import { infoSupportedFetch, selectAllChildCurrencies, selectMarkets, selectWallets } from 'modules';
import { ModalTransferToken } from 'plugins/P2p';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ENUM_WALLET } from 'screens';

export const NewWalletDetail: FC = () => {
	const intl = useIntl();

	useDocumentTitle(intl.formatMessage({ id: 'page.mobile.wallets.title' }));
	const dispatch = useDispatch();
	// hooks
	useWalletsFetch();
	useAllChildCurrenciesFetch();
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();

	const [stateModalTransfer, setStateModalTransfer] = React.useState<{
		currencyId: string;
		showModal: boolean;
	}>({
		currencyId: '',
		showModal: false,
	});
	const { currency } = useParams<{ currency: string }>();
	const history = useHistory();

	const wallets = useSelector(selectWallets);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);
	const markets = useSelector(selectMarkets);
	const [listMarket, setListMarket] = useState(markets);
	useEffect(() => {
		if (markets.length > 0) {
			const showFoward = markets.filter(_market => _market.base_unit.toLowerCase().includes(currency));
			setListMarket(showFoward.length ? showFoward : markets.slice(0, 5));
		}
	}, [markets]);

	useEffect(() => {
		dispatch(infoSupportedFetch());
	}, []);

	const wallet = calcWalletsData(wallets, allChildCurrencies).find(_wallet => _wallet.currency === currency);

	if (!wallet) {
		history.goBack();
	}

	const infoCurrenciesSupport = useP2pPublicInfos();
	const { currencySupported } = infoCurrenciesSupport.infoPublicOrders;

	const handleChooseCurrency = (value: string) => {
		setStateModalTransfer({
			currencyId: value,
			showModal: true,
		});
	};
	const handleCloseShowModal = () => {
		setStateModalTransfer({
			...stateModalTransfer,
			showModal: false,
		});
	};

	const location = {
		pathname: `/wallets`,
		state: { isFunding: false },
	};

	return (
		<div className="td-mobile-wallet-detail">
			<div className="td-mobile-wallet-detail__header">
				<GoBackIcon className="td-mobile-wallet-detail__header__goback" onClick={() => history.push(location)} />
				<h3 className="td-mobile-wallet-detail__header__title">Wallet Detail</h3>
				<Link className="td-mobile-wallet-detail__header__history" to={`/wallets/history`}>
					History
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M18 7.12H11.22L13.96 4.3C11.23 1.6 6.81 1.5 4.08 4.2C1.35 6.91 1.35 11.28 4.08 13.99C6.81 16.7 11.23 16.7 13.96 13.99C15.32 12.65 16 11.08 16 9.1H18C18 11.08 17.12 13.65 15.36 15.39C11.85 18.87 6.15 18.87 2.64 15.39C-0.859996 11.92 -0.889996 6.28 2.62 2.81C6.13 -0.66 11.76 -0.66 15.27 2.81L18 0V7.12ZM9.5 5V9.25L13 11.33L12.28 12.54L8 10V5H9.5Z"
							fill="white"
						/>
					</svg>
				</Link>
			</div>

			{stateModalTransfer.showModal && stateModalTransfer.currencyId && (
				<ModalTransferToken
					onClose={handleCloseShowModal}
					currencyId={stateModalTransfer.currencyId}
					show={stateModalTransfer.showModal}
					from={ENUM_WALLET.SPOT}
				/>
			)}

			<div className="td-mobile-wallet-detail__panel">
				<h2 className="td-mobile-wallet-detail__panel__title">
					{wallet?.currency.toUpperCase()}/{wallet?.name}
				</h2>
				<div className="td-mobile-wallet-detail__panel__row">
					<span className="td-mobile-wallet-detail__panel__row__text">
						{intl.formatMessage({ id: 'page.mobile.wallets.detail.total' })}
					</span>
					<div className="td-mobile-wallet-detail__panel__row__number">
						<span>{_toNumber(wallet?.total).toFixed(wallet?.fixed)}</span> <br />
						<span className="td-mobile-wallet-detail__panel__row__number__estimate">
							≈ $&nbsp;
							<ConvertUsd
								value={Number(wallet?.total)}
								symbol={wallet?.currency || ''}
								precision={4}
								defaultValue={'0.00'}
							/>
						</span>
					</div>
				</div>
				<div className="td-mobile-wallet-detail__panel__row">
					<span className="td-mobile-wallet-detail__panel__row__text">
						{intl.formatMessage({ id: 'page.mobile.wallets.detail.availible' })}
					</span>
					<span className="td-mobile-wallet-detail__panel__row__number">
						{_toNumber(wallet?.balance).toFixed(wallet?.fixed)}
					</span>
				</div>
				<div className="td-mobile-wallet-detail__panel__row">
					<span className="td-mobile-wallet-detail__panel__row__text">
						{intl.formatMessage({ id: 'page.mobile.wallets.detail.locked' })}
					</span>
					<span className="td-mobile-wallet-detail__panel__row__number">
						{_toNumber(wallet?.locked).toFixed(wallet?.fixed)}
					</span>
				</div>

				<div className="td-mobile-wallet-detail__panel__buttons">
					<Link to={`/wallets/${wallet?.currency}/withdraw`} className="td-mobile-wallet-detail__panel__buttons__btn">
						{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' })}
					</Link>
					<Link
						to={`/wallets/${wallet?.currency}/deposit`}
						className="td-mobile-wallet-detail__panel__buttons__btn td-mobile-wallet-detail__panel__buttons__btn--yellow"
					>
						{intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
					</Link>

					{currencySupported.find(e => e.id === wallet?.currency) && (
						<div
							className="td-mobile-wallet-detail__panel__buttons__btn"
							onClick={() => {
								wallet?.currency && handleChooseCurrency(wallet?.currency);
							}}
						>
							Transfer
						</div>
					)}
				</div>
			</div>

			<div className="td-mobile-wallet-detail__market">
				<span className="td-mobile-wallet-detail__market__title">
					{intl.formatMessage({ id: 'page.mobile.wallets.detail.marketTitle' })}
				</span>
				<MarketList isShowTHead={false} listMarket={listMarket} hideFavorite={true} />
			</div>
		</div>
	);
};
