import { LoadingGif } from 'components/LoadingGif';
import { ReactTable } from 'components/ReactTable';
import _toLower from 'lodash/toLower';
import _toNumber from 'lodash/toNumber';
import _toUpper from 'lodash/toUpper';
import millify from 'millify';
import { calcWalletsFundingData } from 'mobile/plugins/P2p/helper';
import NP from 'number-precision';
import { ModalTransferToken } from 'plugins/P2p';
import { PopupBannedUser } from 'plugins/P2p/components';
import { useInfoUser, useP2PBalances, useSocketP2pBalances } from 'plugins/P2p/hooks';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ENUM_WALLET } from '.';
import { Decimal } from '../../components';
import { DEFAULT_CURRENCY_PRECISION } from '../../constants';
import { currenciesFetch, selectCurrencies } from '../../modules';
NP.enableBoundaryChecking(false);

interface IP2PWallet {
	isActiveWallet: 'Coin' | 'Fiat';
	hideSmallBalanceState: boolean;
	searchInputState: string;
}
export const P2PWallet = (props: IP2PWallet) => {
	const intl = useIntl();

	// state
	const { hideSmallBalanceState, searchInputState } = props;
	const [stateIndexPage, setStateIndexPage] = React.useState<number>(1);

	const [stateModalTransfer, setStateModalTransfer] = React.useState<{
		currencyId: string;
		showModal: boolean;
	}>({
		currencyId: '',
		showModal: false,
	});

	// dispatch
	const dispatch = useDispatch();
	const p2pBalance = useP2PBalances({
		page: stateIndexPage,
		hidden: hideSmallBalanceState,
	});

	const { infoUser } = useInfoUser();

	useSocketP2pBalances();

	// side effect
	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, []);
	React.useEffect(() => {
		setStateIndexPage(1);
	}, [hideSmallBalanceState]);

	// selector
	const currencies = useSelector(selectCurrencies);

	const findNameToken = (id: string) => currencies.find(e => e.id === id)?.name;

	const handleCloseShowModal = () => {
		setStateModalTransfer({
			...stateModalTransfer,
			showModal: false,
		});
	};

	const handleChooseCurrency = (value: string) => {
		setStateModalTransfer({
			currencyId: value,
			showModal: true,
		});
	};

	const onGoToPage = (index: number) => {
		setStateIndexPage(index + 1);
	};

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

	const walletCoinList = calcWalletsFundingData(p2pBalance.p2pBalances.data)
		.filter(wallet => _toLower(wallet.currency).includes(_toLower(searchInputState)))
		.map(wallet => {
			return {
				...wallet,
				balance: _toNumber(wallet.balance),
				locked: _toNumber(wallet.locked),
			};
		})
		.map((wallet, index) => {
			const total = NP.plus(wallet.balance || 0, wallet.locked || 0);
			const currency_icon = (
				<img
					style={{ borderRadius: '50%' }}
					width="30px"
					height="30px"
					src={findIcon(wallet.currency)}
					alt={wallet.currency}
				/>
			);
			const { fixed } = { fixed: 8 };

			return {
				coin: (
					<div className="d-flex flex-row align-items-center">
						<div>{currency_icon}</div>
						<div className="ml-3">
							<div>{_toUpper(wallet.currency)}</div>
							<div>
								<span className="text-secondary">{findNameToken(wallet.currency)}</span>
							</div>
						</div>
					</div>
				),
				total: <span>{convertAmount(total > 0 ? total : 0, fixed)}</span>,
				available: <span>{convertAmount(wallet.balance > 0 ? wallet.balance : 0, fixed)}</span>,
				in_order: <span className="text-secondary">{convertAmount(wallet.locked > 0 ? wallet.locked : 0, fixed)}</span>,
				action: (
					<div className="text-center">
						<button
							className="transfer-button"
							style={
								false
									? {
											cursor: 'not-allowed',
											color: 'rgba(132, 142, 156, 0.35)',
									  }
									: {}
							}
							onClick={() => {
								handleChooseCurrency(wallet.currency);
							}}
						>
							Transfer
						</button>
					</div>
				),
			};
		});

	const renderWalletCoinListTable = () => {
		return (
			<ReactTable
				onGoToPage={onGoToPage}
				columns={columns}
				data={[...walletCoinList]}
				pageCount={p2pBalance.p2pBalances.meta.pageCount}
				index={stateIndexPage - 1}
			/>
		);
	};

	return (
		<>
			{stateModalTransfer.showModal && stateModalTransfer.currencyId && (
				<ModalTransferToken
					onClose={handleCloseShowModal}
					currencyId={stateModalTransfer.currencyId}
					show={stateModalTransfer.showModal}
					from={ENUM_WALLET.FUNDING}
				/>
			)}

			{p2pBalance.isLoading && (
				<div style={{ position: 'fixed', zIndex: 9999, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
					<LoadingGif />
				</div>
			)}
			{renderWalletCoinListTable()}

			{infoUser && <PopupBannedUser user={infoUser} />}
		</>
	);
};
