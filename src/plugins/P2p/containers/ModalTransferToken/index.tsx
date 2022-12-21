import { Dropdown, Input, Menu } from 'antd';
import classNames from 'classnames';
import { LoadingGif } from 'components/LoadingGif';
import { selectCurrencies, selectWallets, walletsFetch } from 'modules';
import { p2pTransferToken, p2pValueBalancesFetch, selectP2pValueBalances } from 'modules/plugins/p2p/balances';
import { CustomConvertUsdt } from 'plugins/P2p/components';
import { checkNumberP2p, formatNumberP2p } from 'plugins/P2p/helper';
import { useDebounce, useP2pPublicInfos } from 'plugins/P2p/hooks';
import React, { useState } from 'react';
import { AiFillCaretDown, AiOutlineArrowDown, AiOutlineSwap } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { IoIosCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { ENUM_WALLET } from 'screens';
import { P2pModalBase } from '../P2pModalBase';

interface IModalTransferToken {
	show: boolean;
	currencyId: string;
	onClose: () => void;
	from: ENUM_WALLET;
}

const DEFAULT_WALLET = ['funding', 'spot'];

export const ModalTransferToken = (props: IModalTransferToken) => {
	const { show, onClose, currencyId, from } = props;

	const [swap, setSwap] = useState(true);
	const [amount, setAmount] = useState<string>('');
	const [findToken, setFindToken] = useState<string>('');
	const debouncedFindToken = useDebounce(findToken, 500);
	const [showLoading, setShowLoading] = useState<boolean>(false);
	const [chooseCurrency, setChooseCurrency] = useState<string>(currencyId);
	const [stateTransfer, setStateTransfer] = useState<{
		to: string;
		from: string;
	}>({
		to: '',
		from: '',
	});

	// find amout of token in spot wallet
	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchWallets = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);
	const dispatchFetchWalletsP2p = React.useCallback(() => dispatch(p2pValueBalancesFetch()), [dispatch]);

	const infoCurrenciesSupport = useP2pPublicInfos();
	const { currencySupported } = infoCurrenciesSupport.infoPublicOrders;

	const isCanTransfer = () => {
		const valueAmount = checkNumberP2p(amount).value;
		return !!(
			chooseCurrency &&
			amount &&
			valueAmount > 0 &&
			valueAmount <= getAvailableBalance().available &&
			stateTransfer.to &&
			stateTransfer.from
		);
	};

	// side effect
	React.useEffect(() => {
		dispatchFetchWallets();
		dispatchFetchWalletsP2p();
	}, [dispatchFetchWallets, dispatchFetchWalletsP2p]);

	React.useEffect(() => {
		setStateTransfer({
			from: stateTransfer.to,
			to: stateTransfer.from,
		});
	}, [swap]);

	React.useEffect(() => {
		setAmount('');
	}, [chooseCurrency]);

	React.useEffect(() => {
		if (from) {
			setStateTransfer({
				to: DEFAULT_WALLET.filter(w => w !== from)[0],
				from: from,
			});
		}
	}, []);

	const getAvailableBalance = (): {
		available: number | string;
		inOrder: number | string;
	} => {
		if (stateTransfer.from && chooseCurrency) {
			return {
				available:
					stateTransfer.from === ENUM_WALLET.FUNDING
						? findTokenP2p(chooseCurrency)?.balance || 0
						: findTokenSpot(chooseCurrency)?.balance || 0,
				inOrder:
					stateTransfer.from === ENUM_WALLET.FUNDING
						? findTokenP2p(chooseCurrency)?.locked || 0
						: findTokenSpot(chooseCurrency)?.locked || 0,
			};
		}
		return {
			available: 0,
			inOrder: 0,
		};
	};

	// selector
	const walletsSpot = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const walletsP2p = useSelector(selectP2pValueBalances);

	const findTokenP2p = (currency: string) => {
		return walletsP2p.data.find(balance => balance.currency === currency);
	};

	const findTokenSpot = (currency: string) => {
		return walletsSpot.find(balance => balance.currency === currency);
	};

	const onTransfer = () => {
		const valueAmount = checkNumberP2p(amount).value;
		if (isCanTransfer()) {
			setShowLoading(true);
			if (stateTransfer.from === ENUM_WALLET.FUNDING) {
				dispatch(
					p2pTransferToken({ amount: valueAmount, currency: chooseCurrency, type: 'SEND' }, () => {
						setShowLoading(false);
						onClose();
					}),
				);
			} else {
				dispatch(
					p2pTransferToken({ amount: valueAmount, currency: chooseCurrency, type: 'RECEIVE' }, () => {
						setShowLoading(false);
						onClose();
					}),
				);
			}
		}
	};

	const handleChangeTransferTo = value => {
		if (stateTransfer.from && stateTransfer.from === value) {
			setStateTransfer({
				from: stateTransfer.to,
				to: value,
			});
		} else {
			setStateTransfer({
				...stateTransfer,
				to: value,
			});
		}
	};
	const handleChangeTransferFrom = value => {
		if (stateTransfer.to && stateTransfer.to === value) {
			setStateTransfer({
				to: stateTransfer.from,
				from: value,
			});
		} else {
			setStateTransfer({
				...stateTransfer,
				from: value,
			});
		}
	};

	const handleChangeCurrency = value => {
		setChooseCurrency(value);
	};

	const handlerInputAmount = e => {
		const { render } = checkNumberP2p(String(e.target.value));

		setAmount(render);
	};

	const Loading = () => {
		return showLoading ? (
			<div
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					zIndex: 1000,
				}}
			>
				<LoadingGif />
			</div>
		) : null;
	};

	const getCoinBalance = (idToken: string) => {
		if (stateTransfer.from === ENUM_WALLET.FUNDING) {
			const balance = findTokenP2p(idToken);

			return (
				<>
					<div>{formatNumberP2p(Number(balance?.balance || 0))}</div>
					<div>
						<span>
							$
							<CustomConvertUsdt
								value={Number(balance?.balance)}
								symbol={balance?.currency || ''}
								precision={4}
								defaultValue={'0.00'}
							/>
						</span>
					</div>
				</>
			);
		}

		if (stateTransfer.from === ENUM_WALLET.SPOT) {
			const balance = findTokenSpot(idToken);

			return (
				<>
					<div>{formatNumberP2p(Number(balance?.balance || 0))}</div>
					<div>
						<span>
							$
							<CustomConvertUsdt
								value={Number(balance?.balance || 0)}
								symbol={balance?.currency || ''}
								precision={4}
								defaultValue={'0.00'}
							/>
						</span>
					</div>
				</>
			);
		}

		return null;
	};

	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => currency.id === code);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency !== undefined && currency.icon_url) {
				return currency.icon_url;
			}
			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const menuFrom = (
		<Menu className="p2p-container-modal-transfer__body__box__transfer__drop">
			{DEFAULT_WALLET.filter(wallet => wallet !== stateTransfer.from).map((wallet, index) => {
				return (
					<Menu.Item
						key={index}
						onClick={() => handleChangeTransferFrom(wallet)}
						className="p2p-container-modal-transfer__body__box__transfer__drop__item"
					>
						<div>{wallet.charAt(0).toUpperCase() + wallet.slice(1)}</div>
					</Menu.Item>
				);
			})}
		</Menu>
	);

	const menuTo = (
		<Menu className="p2p-container-modal-transfer__body__box__transfer__drop">
			{DEFAULT_WALLET.filter(wallet => wallet !== stateTransfer.to).map((wallet, index) => {
				return (
					<Menu.Item
						key={index}
						onClick={() => handleChangeTransferTo(wallet)}
						className="p2p-container-modal-transfer__body__box__transfer__drop__item"
					>
						<div>{wallet.charAt(0).toUpperCase() + wallet.slice(1)}</div>
					</Menu.Item>
				);
			})}
		</Menu>
	);

	const classActiveItem = (currencyId: string) =>
		classNames('p2p-container-modal-transfer__body__box__coin__drop__item', {
			'p2p-container-modal-transfer__body__box__coin__drop__item--active': currencyId === chooseCurrency,
		});

	const menuCoin = (
		<Menu className="p2p-container-modal-transfer__body__box__coin__drop">
			<div className="d-flex">
				<Input prefix={<FiSearch />} onChange={e => setFindToken(e.target.value)} suffix={<IoIosCloseCircle />}></Input>
			</div>
			{currencies
				.filter(e => e.type === 'coin')
				.filter(e => e.id.includes(debouncedFindToken))
				.filter(e => currencySupported.find(currency => currency.id === e.id))
				.map((e, index) => (
					<Menu.Item key={index} onClick={() => handleChangeCurrency(e.id)} className={classActiveItem(e.id)}>
						<div>
							<img src={findIcon(e.id)} />
							{e.id.toUpperCase()}
						</div>

						<div className="p2p-container-modal-transfer__body__box__coin__drop__item__balance">
							{getCoinBalance(e.id)}
						</div>
					</Menu.Item>
				))}
		</Menu>
	);

	const getClassActiveBtnConfirm = (): string => {
		return classNames('pg-p2p-config-global__btn', {
			'pg-p2p-config-global__btn--active': isCanTransfer(),
			'pg-p2p-config-global__btn--disable': !isCanTransfer(),
		});
	};

	return (
		<P2pModalBase
			title="Transfer"
			className="p2p-container-modal-transfer"
			haveLine={false}
			onClose={onClose}
			position="left"
			show={show}
		>
			<Loading />
			<div className="p2p-container-modal-transfer__body">
				<div className="p2p-container-modal-transfer__body__box">
					<div className="p2p-container-modal-transfer__body__box__title">
						<div className="p2p-container-modal-transfer__body__box__title__left">Internal transfers are free</div>
					</div>

					<div className="p2p-container-modal-transfer__body__box__transfer">
						<div className="p2p-container-modal-transfer__body__box__transfer__item">
							<div className="p2p-container-modal-transfer__body__box__transfer__item__icon">
								<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M0.25 16.9316V18.6542C0.25 20.1308 3.77734 21.2792 8.125 21.2792C12.4727 21.2792 16 20.1308 16 18.6542V16.9316C14.2773 18.121 11.2012 18.6542 8.125 18.6542C5.00781 18.6542 1.93164 18.121 0.25 16.9316ZM13.375 5.52924C17.7227 5.52924 21.25 4.3808 21.25 2.90424C21.25 1.46869 17.7227 0.279236 13.375 0.279236C9.02734 0.279236 5.5 1.46869 5.5 2.90424C5.5 4.3808 9.02734 5.52924 13.375 5.52924ZM0.25 12.6249V14.7167C0.25 16.1933 3.77734 17.3417 8.125 17.3417C12.4727 17.3417 16 16.1933 16 14.7167V12.6249C14.2773 14.0195 11.2012 14.7167 8.125 14.7167C5.00781 14.7167 1.93164 14.0195 0.25 12.6249ZM17.3125 13.0761C19.6504 12.6249 21.25 11.7636 21.25 10.7792V9.05658C20.2656 9.71283 18.8711 10.164 17.3125 10.4511V13.0761ZM8.125 6.84174C3.77734 6.84174 0.25 8.3183 0.25 10.123C0.25 11.9687 3.77734 13.4042 8.125 13.4042C12.4727 13.4042 16 11.9687 16 10.123C16 8.3183 12.4727 6.84174 8.125 6.84174ZM17.1074 9.17963C19.5684 8.72845 21.25 7.86713 21.25 6.84174V5.11908C19.7734 6.14447 17.2715 6.67767 14.6465 6.84174C15.8359 7.41595 16.7383 8.19525 17.1074 9.17963Z"
										fill="#555555"
									/>
								</svg>
								<span>From</span>
							</div>
							<Dropdown overlay={menuFrom} placement="bottomCenter" trigger={['click']}>
								<div className="p2p-container-modal-transfer__body__box__transfer__item__content">
									{stateTransfer.from.charAt(0).toUpperCase() + stateTransfer.from.slice(1)}

									<div className="p2p-container-modal-transfer__body__box__transfer__item__icon-drop">
										<AiFillCaretDown />
									</div>
								</div>
							</Dropdown>
						</div>

						<div className="p2p-container-modal-transfer__body__box__transfer__middle">
							<div>
								<AiOutlineArrowDown />
							</div>

							<div className="p2p-container-modal-transfer__body__box__transfer__middle__swap">
								<AiOutlineSwap onClick={() => setSwap(!swap)} />
							</div>
						</div>

						<div className="p2p-container-modal-transfer__body__box__transfer__item">
							<div className="p2p-container-modal-transfer__body__box__transfer__item__icon">
								<svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M16.2129 4.36594L12.1934 0.346405C11.9883 0.182343 11.7422 0.0592957 11.4961 0.0592957H11.25V5.3093H16.5V5.0632C16.5 4.81711 16.377 4.57101 16.2129 4.36594ZM9.9375 5.63742V0.0592957H1.73438C1.16016 0.0592957 0.75 0.510468 0.75 1.04367V20.0749C0.75 20.6491 1.16016 21.0593 1.73438 21.0593H15.5156C16.0488 21.0593 16.5 20.6491 16.5 20.0749V6.6218H10.9219C10.3477 6.6218 9.9375 6.21164 9.9375 5.63742ZM3.375 3.01242C3.375 2.84836 3.49805 2.6843 3.70312 2.6843H6.98438C7.14844 2.6843 7.3125 2.84836 7.3125 3.01242V3.66867C7.3125 3.87375 7.14844 3.9968 6.98438 3.9968H3.70312C3.49805 3.9968 3.375 3.87375 3.375 3.66867V3.01242ZM3.375 6.29367V5.63742C3.375 5.47336 3.49805 5.3093 3.70312 5.3093H6.98438C7.14844 5.3093 7.3125 5.47336 7.3125 5.63742V6.29367C7.3125 6.49875 7.14844 6.6218 6.98438 6.6218H3.70312C3.49805 6.6218 3.375 6.49875 3.375 6.29367ZM9.28125 17.1218V18.1062C9.28125 18.3112 9.11719 18.4343 8.95312 18.4343H8.29688C8.0918 18.4343 7.96875 18.3112 7.96875 18.1062V17.1218C7.47656 17.1218 7.02539 16.9577 6.65625 16.6706C6.49219 16.5476 6.49219 16.3015 6.65625 16.1784L7.10742 15.7273C7.23047 15.6042 7.39453 15.6042 7.51758 15.6862C7.68164 15.7683 7.88672 15.8093 8.05078 15.8093H9.19922C9.48633 15.8093 9.69141 15.6042 9.69141 15.2761C9.69141 15.03 9.56836 14.8249 9.32227 14.7839L7.47656 14.2097C6.73828 13.9636 6.20508 13.2663 6.20508 12.446C6.20508 11.4206 6.98438 10.6003 7.92773 10.6003V9.57492C7.92773 9.41086 8.0918 9.2468 8.25586 9.2468H8.91211C9.11719 9.2468 9.24023 9.41086 9.24023 9.57492V10.6003C9.73242 10.6003 10.1836 10.7644 10.5527 11.0515C10.7168 11.1745 10.7168 11.4206 10.5527 11.5437L10.1016 11.9948C9.97852 12.1179 9.81445 12.1179 9.69141 12.0359C9.52734 11.9538 9.32227 11.8718 9.1582 11.8718H8.00977C7.72266 11.8718 7.51758 12.1179 7.51758 12.446C7.51758 12.6921 7.64062 12.8972 7.88672 12.9382L9.73242 13.5124C10.4707 13.7175 11.0039 14.4558 11.0039 15.2761C11.0039 16.3015 10.2246 17.1218 9.28125 17.1218Z"
										fill="#555555"
									/>
								</svg>
								<span>To</span>
							</div>

							<Dropdown overlay={menuTo} placement="bottomCenter" trigger={['click']}>
								<div className="p2p-container-modal-transfer__body__box__transfer__item__content">
									{stateTransfer.to.charAt(0).toUpperCase() + stateTransfer.to.slice(1)}

									<div className="p2p-container-modal-transfer__body__box__transfer__item__icon-drop">
										<AiFillCaretDown />
									</div>
								</div>
							</Dropdown>
						</div>
					</div>
				</div>

				{/*  */}

				<div className="p2p-container-modal-transfer__body__box__line"> </div>

				<Dropdown overlay={menuCoin} placement="bottomCenter" trigger={['click']}>
					<div className="p2p-container-modal-transfer__body__box">
						<div className="p2p-container-modal-transfer__body__box__title">
							<div className="p2p-container-modal-transfer__body__box__title__left">Coin</div>
						</div>

						<div className="p2p-container-modal-transfer__body__box__coin">
							<div className="p2p-container-modal-transfer__body__box__coin__box">
								{chooseCurrency && (
									<div className="p2p-container-modal-transfer__body__box__coin__icon">
										<img src={findIcon(chooseCurrency)} />
									</div>
								)}

								<div className="p2p-container-modal-transfer__body__box__coin__content">
									{chooseCurrency?.toUpperCase()}
								</div>
							</div>

							<div>
								<AiFillCaretDown />
							</div>
						</div>
					</div>
				</Dropdown>

				{/*  */}

				<div className="p2p-container-modal-transfer__body__box">
					<div className="p2p-container-modal-transfer__body__box__title  p2p-container-modal-transfer__body__box__padding-top">
						<div className="p2p-container-modal-transfer__body__box__title__left">Amount</div>
						<div className="p2p-container-modal-transfer__body__box__title__right">
							{stateTransfer.from && chooseCurrency && (
								<>
									{+getAvailableBalance().available === 0
										? '0.000000'
										: formatNumberP2p(+getAvailableBalance().available)}{' '}
									<span>available</span> /{' '}
									{+getAvailableBalance().inOrder === 0
										? '0.000000'
										: formatNumberP2p(+getAvailableBalance().inOrder)}{' '}
									<span>in order</span>
								</>
							)}
						</div>
					</div>

					<div className="p2p-container-modal-transfer__body__box__amount">
						<Input
							type={'text'}
							min={0}
							value={amount}
							onChange={handlerInputAmount}
							suffix={
								<div
									className="p2p-container-modal-transfer__body__box__amount__max"
									onClick={() => {
										const { render } = checkNumberP2p(
											(stateTransfer.from === ENUM_WALLET.FUNDING
												? findTokenP2p(chooseCurrency)?.balance || 0
												: findTokenSpot(chooseCurrency)?.balance || 0
											).toString(),
										);
										setAmount(render);
									}}
								>
									Max
								</div>
							}
						/>
					</div>
					{chooseCurrency && checkNumberP2p(amount).value > getAvailableBalance().available && stateTransfer.from && (
						<div className="p2p-container-modal-transfer__body__box__error">Balance is not enough</div>
					)}
				</div>

				<div className="p2p-container-modal-transfer__body__btn-confirm">
					<button className={getClassActiveBtnConfirm()} onClick={onTransfer}>
						Confirm
					</button>
				</div>
			</div>
		</P2pModalBase>
	);
};
