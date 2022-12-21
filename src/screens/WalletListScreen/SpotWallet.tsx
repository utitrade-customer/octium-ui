import _toLower from 'lodash/toLower';
import _toNumber from 'lodash/toNumber';
import _toUpper from 'lodash/toUpper';
import millify from 'millify';
import NP, { plus } from 'number-precision';
import { ModalTransferToken } from 'plugins/P2p';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ENUM_WALLET } from '.';
import { Decimal, ReactTable } from '../../components';
import { DEFAULT_CURRENCY_PRECISION } from '../../constants';
import {
	allChildCurrenciesFetch,
	beneficiariesFetch,
	currenciesFetch,
	selectAllChildCurrencies,
	selectCurrencies,
	selectWallets,
	walletsFetch,
} from '../../modules';
NP.enableBoundaryChecking(false);

interface ISpotWallet {
	isActiveWallet: 'Coin' | 'Fiat';
	hideSmallBalanceState: boolean;
	searchInputState: string;
}

export const SpotWallet = (props: ISpotWallet) => {
	const intl = useIntl();

	// state
	const { isActiveWallet, hideSmallBalanceState, searchInputState } = props;

	const [stateModalTransfer, setStateModalTransfer] = React.useState<{
		currencyId: string;
		showModal: boolean;
	}>({
		currencyId: '',
		showModal: false,
	});

	// intl
	const withdrawButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' }), [intl]);
	const depositButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' }), [intl]);

	const infoCurrenciesSupport = useP2pPublicInfos();
	const { currencySupported } = infoCurrenciesSupport.infoPublicOrders;

	// history
	const history = useHistory();

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
	}, [dispatchFetchBeneficiaries, dispatchFetchWallets, dispatchcFetchCurrencies, dispatchcFetchAllChildCurrencies]);

	// selector
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	// function
	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => currency.id === code);
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency !== undefined && currency.icon_url) {
				return currency.icon_url;
			}
			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

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

	const columns = React.useMemo(
		() => [
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.coin' }), accessor: 'coin' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.total' }), accessor: 'total' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.available' }), accessor: 'available' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.inOrder' }), accessor: 'in_order' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.action' }), accessor: 'action' },
		],
		[],
	);

	const convertAmount = (amount: number, fixed: number) => {
		const largeAmountString = (amount: string) => {
			const amountArray = amount.split('');
			const accurency = amountArray.pop();
			const amountString = amountArray.join('');
			return (
				<span>
					<span>{amountString}</span>
					<span className="ml-1" style={{ color: 'var(--yellow)' }}>
						{accurency}
					</span>
				</span>
			);
		};
		return Number(amount) >= 100000000 ? (
			largeAmountString(
				millify(Number(amount), {
					precision: fixed,
				}),
			)
		) : (
			<Decimal fixed={DEFAULT_CURRENCY_PRECISION}>{amount}</Decimal>
		);
	};

	const walletCoinList = wallets
		.filter(wallet => wallet.type === 'coin')
		.filter(wallet => !allChildCurrencies.map(cur => cur.id).includes(wallet.currency))
		.filter(wallet => _toLower(wallet.currency).includes(_toLower(searchInputState)))
		.map(wallet => {
			const childCurrencies = allChildCurrencies
				.filter(childCurrency => childCurrency.parent_id === wallet.currency)
				.map(childCurrency => childCurrency.id);

			const allChildWallets = wallets.filter(wallet => childCurrencies.includes(wallet.currency));
			const allCurrencies = currencies.filter(currency => childCurrencies.includes(currency.id));

			const totalChildBalances = allChildWallets.map(child => Number(child.balance)).reduce((x, y) => x + y, 0);

			const totalChildLocked = allChildWallets.map(child => Number(child.locked)).reduce((x, y) => x + y, 0);

			const childDepositEnabled = allCurrencies.map(child => child.deposit_enabled);
			const isLeastChildDepositEnabled = childDepositEnabled.find(isEnabled => isEnabled === true);
			const childWithdrawEnabled = allCurrencies.map(child => child.withdrawal_enabled);
			const isLeastChildWithdrawEnabled = childWithdrawEnabled.find(isEnabled => isEnabled === true);
			return {
				...wallet,
				total: plus(_toNumber(wallet.balance), _toNumber(wallet.locked), totalChildBalances, totalChildLocked),
				balance: plus(_toNumber(wallet.balance), totalChildBalances),
				locked: plus(Number(wallet.locked), totalChildLocked),
				isChildDepositEnabled: isLeastChildDepositEnabled,
				isChildWithdrawEnabled: isLeastChildWithdrawEnabled,
			};
		})
		.filter(wallet => (hideSmallBalanceState ? wallet.total > 0 : true))
		.sort((prev_wallet, next_wallet) => {
			//sort desc
			return next_wallet.total - prev_wallet.total;
		})
		.map((wallet, index) => {
			const total = NP.plus(wallet.balance || 0, wallet.locked || 0);
			const currency_icon = (
				<img
					style={{ borderRadius: '50%' }}
					width="30px"
					height="30px"
					src={wallet.iconUrl ? wallet.iconUrl : findIcon(wallet.currency)}
					alt={wallet.currency}
				/>
			);
			const { fixed } = wallets.find(w => w.currency === wallet.currency) || { fixed: 8 };

			const { deposit_enabled, withdrawal_enabled } = currencies.find(
				currency => _toLower(currency.id) === _toLower(wallet.currency),
			) || { deposit_enabled: false, withdrawal_enabled: false };
			return {
				coin: (
					<div className="d-flex flex-row align-items-center">
						<div>{currency_icon}</div>
						<div className="ml-3">
							<div>{_toUpper(wallet.currency)}</div>
							<div>
								<span className="text-secondary">{wallet.name}</span>
							</div>
						</div>
					</div>
				),
				total: <span>{convertAmount(total > 0 ? total : 0, fixed)}</span>,
				available: <span>{convertAmount(wallet.balance > 0 ? wallet.balance : 0, fixed)}</span>,
				in_order: <span className="text-secondary">{convertAmount(wallet.locked > 0 ? wallet.locked : 0, fixed)}</span>,
				action: (
					<div className="text-center box-btn-action">
						{currencySupported.find(e => e.id === wallet.currency) && (
							<button
								className="transfer-button"
								style={
									!withdrawal_enabled && !wallet.isChildWithdrawEnabled
										? {
												cursor: 'not-allowed',
												color: 'rgba(132, 142, 156, 0.35)',
										  }
										: {}
								}
								disabled={!withdrawal_enabled && !wallet.isChildWithdrawEnabled}
								onClick={() => {
									handleChooseCurrency(wallet.currency);
								}}
							>
								Transfer
							</button>
						)}

						<button
							className="deposit-button"
							disabled={!deposit_enabled && !wallet.isChildDepositEnabled}
							style={
								!deposit_enabled && !wallet.isChildDepositEnabled
									? {
											cursor: 'not-allowed',
											color: 'rgba(132, 142, 156, 0.35)',
									  }
									: {}
							}
							onClick={() => history.push({ pathname: '/wallets/deposit/' + _toUpper(wallet.currency) })}
						>
							{depositButtonLabel}
						</button>
						<button
							className="withdraw-button"
							style={
								!withdrawal_enabled && !wallet.isChildWithdrawEnabled
									? {
											cursor: 'not-allowed',
											color: 'rgba(132, 142, 156, 0.35)',
									  }
									: {}
							}
							disabled={!withdrawal_enabled && !wallet.isChildWithdrawEnabled}
							onClick={() => history.push({ pathname: '/wallets/withdraw/' + _toUpper(wallet.currency) })}
						>
							{withdrawButtonLabel}
						</button>
					</div>
				),
			};
		});

	const walletPaypalFiatList = wallets
		.filter(wallet => {
			const isFiat = wallet.type === 'fiat';
			const isHidingZeroBalance = hideSmallBalanceState
				? plus(_toNumber(wallet.balance), _toNumber(wallet.locked)) > 0
				: true;
			const isSearch = wallet.currency ? _toLower(wallet.currency).includes(_toLower(searchInputState)) : true;
			return isFiat && isHidingZeroBalance && isSearch;
		})

		.map((wallet, index) => {
			const total = NP.plus(wallet.balance || 0, wallet.locked || 0);
			const quoteCurrency = _toLower(wallet.currency.split('-')[1]);
			const currency_icon = (
				<img
					style={{ borderRadius: '50%' }}
					width="30px"
					height="30px"
					src={wallet.iconUrl ? wallet.iconUrl : findIcon(quoteCurrency)}
					alt={wallet.currency}
				/>
			);
			const { fixed } = wallets.find(w => w.currency === wallet.currency) || { fixed: 8 };

			const { deposit_enabled, withdrawal_enabled } = currencies.find(
				currency => _toLower(currency.id) === _toLower(wallet.currency),
			) || { deposit_enabled: false, withdrawal_enabled: false };
			return {
				coin: (
					<div className="d-flex flex-row align-items-center">
						<div>{currency_icon}</div>
						<div className="ml-3">
							<div>{_toUpper(quoteCurrency)}</div>
							<div>
								<span className="text-secondary">{wallet.name}</span>
							</div>
						</div>
					</div>
				),
				total: <span>{convertAmount(total > 0 ? total : 0, fixed)}</span>,
				totalvalue: total,
				available: (
					<span>
						{convertAmount(wallet.balance && _toNumber(wallet.balance) > 0 ? _toNumber(wallet.balance) : 0, fixed)}
					</span>
				),
				in_order: (
					<span className="text-secondary">
						{convertAmount(wallet.locked && _toNumber(wallet.locked) > 0 ? _toNumber(wallet.locked) : 0, fixed)}
					</span>
				),
				action: (
					<div className="text-center">
						<button
							className="deposit-button"
							disabled={!deposit_enabled}
							style={
								!deposit_enabled
									? {
											cursor: 'not-allowed',
											color: 'rgba(132, 142, 156, 0.35)',
									  }
									: {}
							}
							onClick={() => history.push({ pathname: `/wallets/deposit/fiat/${_toUpper(wallet.currency)}` })}
						>
							{depositButtonLabel}
						</button>
						<button
							className="withdraw-button"
							style={
								!withdrawal_enabled
									? {
											cursor: 'not-allowed',
											color: 'rgba(132, 142, 156, 0.35)',
									  }
									: {}
							}
							disabled={!withdrawal_enabled}
							onClick={() => history.push({ pathname: `/wallets/withdraw/fiat/${_toUpper(wallet.currency)}` })}
						>
							{withdrawButtonLabel}
						</button>
					</div>
				),
			};
		})
		.sort((prev_wallet, next_wallet) => {
			//sort desc
			return next_wallet.totalvalue - prev_wallet.totalvalue;
		});

	const renderWalletCoinListTable = () => {
		return <ReactTable columns={columns} data={[...walletCoinList]} />;
	};

	const renderWalletFiatListTable = () => {
		return <ReactTable columns={columns} data={[...walletPaypalFiatList]} />;
	};

	return (
		<>
			{stateModalTransfer.showModal && stateModalTransfer.currencyId && (
				<ModalTransferToken
					onClose={handleCloseShowModal}
					currencyId={stateModalTransfer.currencyId}
					show={stateModalTransfer.showModal}
					from={ENUM_WALLET.SPOT}
				/>
			)}

			{isActiveWallet === 'Coin' ? renderWalletCoinListTable() : renderWalletFiatListTable()}
		</>
	);
};
