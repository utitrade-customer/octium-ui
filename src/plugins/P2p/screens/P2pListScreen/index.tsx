import { Button } from 'antd';
import classNames from 'classnames';
import { LoadingGif } from 'components/LoadingGif';
import { CustomDropBox, P2pModal, P2pNavBar } from 'plugins/P2p/components';
import P2pEmpty from 'plugins/P2p/components/P2pEmpty';
import {
	checkNumberP2p,
	getInfoCacheFilterListOrder as cacheFilter,
	setInfoCacheFilterListOrder as setCacheFilter,
} from 'plugins/P2p/helper';
import {
	useDebounce,
	useGetListPublicOrders,
	useInfoUser,
	useP2PFindBalanceToken,
	useP2pPublicInfos,
	useP2PValueBalances,
} from 'plugins/P2p/hooks';
import React, { useEffect, useState } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaSyncAlt } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { ItemRowP2p } from './itemRowP2p';

// tslint:disable-next-line: no-empty-interface
interface P2pListScreenProps {}

const refreshOptions = ['Not now', '5', '10', '20'];

export interface IItemShow {
	show: boolean;
	id: number | undefined;
}

let autoReload;

export const P2pListScreen: React.FC<P2pListScreenProps> = ({}) => {
	const typeCache = cacheFilter('type') as 'buy' | 'sell';
	const [tradingTypeState, setTradingTypeState] = useState<'buy' | 'sell'>(typeCache || 'buy');
	const [refreshOption, setRefreshOption] = useState('Refresh');
	const [isRefreshOptionDropdownVisible, setIsRefreshOptionDropdownVisible] = useState(false);
	const [fiat, setFiat] = useState('');
	const [payment, setPayment] = useState<undefined | number>();
	const [countDownRefresh, setCountDownRefresh] = useState(0);

	const [currency, setCurrency] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [page, setPage] = useState(1);
	const [orderMinRender, setOrderMinRender] = useState<string>('');
	const [orderMin, setOrderMin] = useState<string>('');
	const [itemShow, setItemShow] = useState<IItemShow>({
		show: false,
		id: undefined,
	});

	const valueOrderMin = useDebounce(orderMin, 500);

	const balanceToken = useP2PFindBalanceToken((currency + '').toLocaleLowerCase());

	useInfoUser();
	const { totalBTC } = useP2PValueBalances();

	const infoOrderPublic = useP2pPublicInfos();
	const ordersPublic = useGetListPublicOrders({
		fiat: fiat,
		currency: currency,
		page: page,
		timeReload: refreshOption === 'Refresh' || refreshOption === refreshOptions[0] ? undefined : +refreshOption,
		orderMin: +valueOrderMin,
		payment: payment,
		type: tradingTypeState,
	});

	const { currencySupported, fiatSupported, paymentSupported } = infoOrderPublic.infoPublicOrders;

	useEffect(() => {
		setPage(ordersPublic.ordersPublic.meta.page);
	}, [ordersPublic.ordersPublic.meta.page]);

	useEffect(() => {
		const fiatCache = cacheFilter('fiat');
		if (fiatCache && fiatSupported.find(e => e.id === fiatCache)) {
			setFiat(fiatCache.toUpperCase());
		} else {
			fiatSupported[0] && setFiat(fiatSupported[0].id.toUpperCase());
		}
	}, [fiatSupported]);

	useEffect(() => {
		const currencyCache = cacheFilter('currency');
		if (currencyCache && currencySupported.find(e => e.id === currencyCache)) {
			setCurrency(currencyCache.toUpperCase());
		} else {
			currencySupported[0] && setCurrency(currencySupported[0].id.toUpperCase());
		}
	}, [currencySupported]);

	useEffect(() => {
		const paymentCache = cacheFilter('payment');

		if (paymentCache && !paymentSupported.find(e => e.id === +paymentCache)) {
			setPayment(undefined);
			return;
		}

		if (paymentCache && paymentSupported.find(e => e.id === +paymentCache)) {
			setPayment(+paymentCache);
		} else {
			paymentSupported[0] && setPayment(paymentSupported[0].id);
		}
	}, [paymentSupported]);

	useEffect(() => {
		if (refreshOption !== 'Refresh' && refreshOption !== refreshOptions[0]) {
			setCountDownRefresh(+refreshOption);
			autoReload = setInterval(() => {
				setCountDownRefresh(prev => {
					if (prev === 1) {
						return +refreshOption;
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			setCountDownRefresh(0);
			clearInterval(autoReload);
		}

		return () => {
			clearInterval(autoReload);
		};
	}, [refreshOption]);

	const onSelectPayment = (name: string) => {
		const idPayment = paymentSupported.find(item => item.name === name)?.id || 'All payments';
		setPayment(+idPayment);
		setCacheFilter('payment', idPayment + '');
	};

	const onSelectFiat = (name: string) => {
		setFiat(name);
		setCacheFilter('fiat', name.toLocaleLowerCase());
	};

	const onSelectCurrency = (name: string) => {
		setCurrency(name);
		setCacheFilter('currency', name.toLocaleLowerCase());
	};

	const onSelectTradingType = (name: 'buy' | 'sell') => {
		setTradingTypeState(name);
		setCacheFilter('type', name);
	};

	const handleChangePage = (value: number) => {
		setPage(value + 1);
	};

	const handlerInputOrderMin = e => {
		const { render, value } = checkNumberP2p(e.target.value);
		setOrderMinRender(render);
		setOrderMin(value + '');
	};

	const classItemCoin = (name: string) => {
		return classNames('p2p-screen__header__coin-list__coin', {
			'p2p-screen__header__coin-list__coin--active': currency == name,
		});
	};

	const RenderListCoinOfHeaderTable = () => {
		return (
			<div className="p2p-screen__header__coin-list">
				{currencySupported.map((currencyItem, key) => (
					<div
						className={classItemCoin(currencyItem.id.toUpperCase())}
						key={key}
						onClick={() => onSelectCurrency(currencyItem.id.toUpperCase())}
					>
						{currencyItem.id.toUpperCase()}
					</div>
				))}
			</div>
		);
	};

	const RenderHeader = () => {
		const tradeTypeClassName = 'p2p-screen__header__toggle__btn';

		const classBtnToggleBuy = classNames(tradeTypeClassName, {
			[`${tradeTypeClassName}--buy`]: tradingTypeState === 'sell',
		});

		const classBtnToggleSell = classNames(tradeTypeClassName, {
			[`${tradeTypeClassName}--sell`]: tradingTypeState === 'buy',
		});

		return (
			<div className="box-wrapper">
				<div className="container">
					<div className="p2p-screen__header ">
						<div className="p2p-screen__header__toggle ">
							<div className={classBtnToggleBuy} onClick={() => onSelectTradingType('sell')}>
								Buy
							</div>
							<div className={classBtnToggleSell} onClick={() => onSelectTradingType('buy')}>
								Sell
							</div>
						</div>
						<RenderListCoinOfHeaderTable />
					</div>
				</div>
			</div>
		);
	};

	window.addEventListener('click', function (event) {
		if (document.getElementById('refresh-button') && event.target !== null) {
			if (!document.getElementById('refresh-button')?.contains(event.target as Node) && isRefreshOptionDropdownVisible) {
				setIsRefreshOptionDropdownVisible(false);
			}
		}
	});

	const renderTextPrice = () => {
		if (tradingTypeState === 'buy') {
			return 'Price (Higher to Lower)';
		}

		return 'Price (Lower to Higher)';
	};

	const classActiveRefreshOption = value =>
		classNames('p2p-screen__body__header__refresh-btn-container__dropdown__option', {
			'p2p-screen__body__header__refresh-btn-container__dropdown__option--active': refreshOption === value,
		});
	return (
		<>
			<div className="p2p-screen">
				<P2pNavBar />

				<RenderHeader />

				<div className="p2p-screen__body container">
					<div
						id="p2p-screen__body__second-header"
						className="d-flex flex-row justify-content-between align-items-center pr-3 pl-3"
						style={{
							backgroundColor: 'rgb(var(--rgb-body-background-color))',
							paddingTop: '2em',
							boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
						}}
					>
						<div className="p2p-screen__body__header container-fluid">
							<div className="p2p-screen__body__header__amount">
								<div className="p2p-screen__body__header__amount__label">Amount</div>

								<div className="p2p-screen__body__header__amount__box">
									<input
										className="p2p-screen__body__header__amount__box__input"
										type="text"
										placeholder="Enter min order"
										value={orderMinRender}
										onChange={handlerInputOrderMin}
									/>

									<span className="p2p-screen__body__header__amount__box__fiat-addon">{fiat}</span>
								</div>
							</div>
							<div className="p2p-screen__body__header__fiat">
								<div className="p2p-screen__body__header__fiat__label">Fiat</div>

								<CustomDropBox
									isForFiat={true}
									values={fiatSupported.map(e => e.id.toUpperCase())}
									imgs={fiatSupported.map(e => e.img || '')}
									value={fiat}
									onSelect={onSelectFiat}
									dropdownWidth="11em"
								/>
							</div>
							<div className="p2p-screen__body__header__payment">
								<div className="p2p-screen__body__header__payment__label">Payment</div>
								<CustomDropBox
									values={['All payments', ...paymentSupported.map(e => e.name)]}
									value={paymentSupported.find(e => e.id === payment)?.name || 'All payments'}
									dropdownWidth="16em"
									onSelect={onSelectPayment}
								/>
							</div>
						</div>
						<div id="refresh-button" className="p2p-screen__body__header__refresh-btn-container">
							<Button
								className="p2p-screen__body__header__refresh-btn-container__refresh-btn"
								onClick={() => setIsRefreshOptionDropdownVisible(state => !state)}
							>
								{!!Number(refreshOption) && ordersPublic.isLoading ? (
									<BiLoaderCircle style={{ color: 'white', marginRight: '0.5em', minWidth: '1em' }} />
								) : (
									<FaSyncAlt style={{ color: 'white', marginRight: '0.5em', minWidth: '1em' }} />
								)}

								{!!Number(refreshOption) ? countDownRefresh + 's to refresh' : refreshOption}
							</Button>
							<div
								className={`p2p-screen__body__header__refresh-btn-container__dropdown  ${
									isRefreshOptionDropdownVisible &&
									'p2p-screen__body__header__refresh-btn-container__dropdown--show'
								}`}
							>
								{refreshOptions.map((option, index) => {
									return (
										<p
											key={index}
											className={classActiveRefreshOption(option)}
											onClick={() => {
												setRefreshOption(option);
												setIsRefreshOptionDropdownVisible(false);
											}}
										>
											{!!Number(option) ? option + 's to refresh' : option}
										</p>
									);
								})}
							</div>
						</div>
					</div>

					<div className="p2p-screen__body__table">
						{/* <RenderLoading /> */}
						<div className="p2p-screen__body__table__body">
							<div className="p2p-screen__body__table__body__first"></div>
							<div className="p2p-screen__body__table__body__main">
								<div className="p2p-screen__body__table__body__main__table-data">
									<div className="p2p-screen__body__table__body__main__table-data__header">
										<div className="p2p-screen__body__table__body__main__table-data__header__item--adv">
											Advertisers
										</div>

										<div className="p2p-screen__body__table__body__main__table-data__header__item--pri">
											{renderTextPrice()}
										</div>

										<div className="p2p-screen__body__table__body__main__table-data__header__item--lim">
											Limit/Available
										</div>

										<div className="p2p-screen__body__table__body__main__table-data__header__item--pay">
											Payment
										</div>

										<div className="p2p-screen__body__table__body__main__table-data__header__item--tra">
											<div>Trade</div>
											<div className="p2p-screen__body__table__body__main__table-data__header__item--tra__info">
												0 Fee
											</div>
										</div>
									</div>

									<div className="p2p-screen__body__table__body__main__table-data__body">
										{ordersPublic.isLoading && (
											<div className="p2p-screen__body__table__body__main__table-data__body__loading">
												<LoadingGif />
											</div>
										)}

										{ordersPublic.ordersPublic.data.length === 0 ? (
											<>{!ordersPublic.isLoading && <P2pEmpty />}</>
										) : (
											<>
												{ordersPublic.ordersPublic.data.map(item => (
													<ItemRowP2p
														item={item}
														infoOrder={infoOrderPublic.infoPublicOrders}
														key={item.id}
														itemShow={itemShow}
														setItemShow={setItemShow}
														balance={balanceToken.balance ? balanceToken.balance.balance : 0}
														totalBTC={totalBTC}
													/>
												))}
											</>
										)}
									</div>
								</div>
							</div>

							{!ordersPublic.isLoading && !(ordersPublic.ordersPublic.data.length === 0) && (
								<div className="p2p-screen__body__table__body__pagination">
									<div id="udon-p2p-list__pagination" className="w-100 d-flex flex-row justify-content-center">
										<ReactPaginate
											previousLabel={'<'}
											nextLabel={'>'}
											breakLabel={'...'}
											breakClassName={'break-me'}
											pageCount={ordersPublic.ordersPublic.meta.pageCount}
											marginPagesDisplayed={2}
											pageRangeDisplayed={5}
											onPageChange={e => handleChangePage(e.selected)}
											containerClassName={'pagination'}
											activeClassName={'active'}
											forcePage={page - 1 || 0}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<P2pModal visiable={showModal} onClose={() => setShowModal(false)} />
			</div>
		</>
	);
};
