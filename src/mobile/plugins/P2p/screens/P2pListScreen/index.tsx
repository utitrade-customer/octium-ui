import { Button, Drawer } from 'antd';
import classNames from 'classnames';
import { PaginationMobile } from 'mobile/components';
import { P2pNavBar } from 'mobile/plugins';
import { useP2pPublicInfos, useGetListPublicOrders, useDebounce, useP2PFindBalanceToken } from 'plugins/P2p/hooks';
import * as React from 'react';
import { BiFilterAlt } from 'react-icons/bi';
import { HiRefresh } from 'react-icons/hi';
import P2pEmpty from '../../components/P2pEmpty';
import { P2pFilterDrawer } from '../../components/P2pFilterDrawer';
import { P2pItemComponent } from './../../components/P2pItemForList';
import { getInfoCacheFilterListOrder as cacheFilter, setInfoCacheFilterListOrder as setCacheFilter } from 'plugins/P2p/helper';
import { LoadingGif } from 'components/LoadingGif';

// tslint:disable-next-line: no-empty-interface
interface P2pListMobileScreenProps {}

const refreshOptions = ['Not now', '5', '10', '20'];

export const P2pListMobileScreen: React.FC<P2pListMobileScreenProps> = ({}) => {
	const typeCache = cacheFilter('type') as 'buy' | 'sell';
	const [tradingTypeState, setTradingTypeState] = React.useState<'buy' | 'sell'>(typeCache || 'buy');
	const [showFilterDrawer, setShowFilterDrawer] = React.useState(false);
	const [showReloadDrawer, setShowReloadDrawer] = React.useState(false);
	const [refreshOption, setRefreshOption] = React.useState('Refresh');
	const [openMoreDropdown, setOpenMoreDropdown] = React.useState(false);
	const [orderMin, setOrderMin] = React.useState<string>('');
	const valueOrderMin = useDebounce(orderMin, 500);

	const [fiat, setFiat] = React.useState('');
	const [payment, setPayment] = React.useState<undefined | number>();
	const [currency, setCurrency] = React.useState('');
	const [page, setPage] = React.useState(1);
	const infoOrderPublic = useP2pPublicInfos();

	const balanceToken = useP2PFindBalanceToken((currency + '').toLocaleLowerCase());

	const ordersPublic = useGetListPublicOrders({
		fiat: fiat,
		currency: currency,
		page: page,
		timeReload: refreshOption === 'Refresh' || refreshOption === refreshOptions[0] ? undefined : +refreshOption,
		orderMin: +valueOrderMin,
		payment: payment,
		type: tradingTypeState,
	});

	const { currencySupported } = infoOrderPublic.infoPublicOrders;
	React.useEffect(() => {
		const currencyCache = cacheFilter('currency');
		if (currencyCache && currencySupported.find(e => e.id === currencyCache)) {
			setCurrency(currencyCache.toUpperCase());
		} else {
			currencySupported[0] && setCurrency(currencySupported[0].id.toUpperCase());
		}
	}, [currencySupported]);

	React.useEffect(() => {
		setPage(ordersPublic.ordersPublic.meta.page);
	}, [ordersPublic.ordersPublic.meta.page]);

	const onSelectCurrency = (name: string) => {
		setCurrency(name);
		setCacheFilter('currency', name.toLocaleLowerCase());
	};

	const handleChangePage = (value: number) => {
		setPage(value + 1);
	};

	const onSelectTradingType = (name: 'buy' | 'sell') => {
		setTradingTypeState(name);
		setCacheFilter('type', name);
	};

	const RenderHeader = () => {
		const tradeTypeClassName = 'p2p-mobile-screen-p2p-list__header__toggle__btn';

		const classBtnToggleBuy = classNames(tradeTypeClassName, {
			[`${tradeTypeClassName}--buy`]: tradingTypeState === 'sell',
		});

		const classBtnToggleSell = classNames(tradeTypeClassName, {
			[`${tradeTypeClassName}--sell`]: tradingTypeState === 'buy',
		});

		return (
			<div className="p2p-mobile-screen-p2p-list__header container-fluid">
				<div className="d-flex flex-row justify-content-between align-items-center">
					<div className="p2p-mobile-screen-p2p-list__header__toggle ">
						<div className={classBtnToggleBuy} onClick={() => onSelectTradingType('sell')}>
							Buy
						</div>
						<div className={classBtnToggleSell} onClick={() => onSelectTradingType('buy')}>
							Sell
						</div>
					</div>
					<div className="d-flex flex-row">
						<Button style={{ backgroundColor: 'transparent', border: 'none' }} shape="circle">
							<HiRefresh style={{ width: '3em', height: '1.5em' }} onClick={() => setShowReloadDrawer(true)} />
						</Button>
						<Button style={{ backgroundColor: 'transparent', border: 'none' }} shape="circle">
							<BiFilterAlt style={{ width: '3em', height: '1.5em' }} onClick={() => setShowFilterDrawer(true)} />
						</Button>
					</div>
				</div>
				<div className="p2p-mobile-screen-p2p-list__header__control">
					<div className="p2p-mobile-screen-p2p-list__header__control__bottom-container">{renderCurrencies()}</div>
				</div>
			</div>
		);
	};

	const renderCurrencies = () => {
		if (currencySupported.length == 0) {
			return null;
		}
		return currencySupported.map((currencyItem, index) => {
			const currencyClassName = 'p2p-mobile-screen-p2p-list__header__control__bottom-container__btn';

			return (
				<button
					className={classNames(currencyClassName, {
						[`${currencyClassName}--active`]: currencyItem.id.toUpperCase() == currency,
					})}
					key={index}
					onClick={() => onSelectCurrency(currencyItem.id.toUpperCase())}
				>
					{currencyItem.id.toUpperCase()}
				</button>
			);
		});
	};

	window.addEventListener('click', function (event) {
		if (document.getElementById('p2p__nav-bar__more-dropdown') && event.target !== null) {
			if (!document.getElementById('p2p__nav-bar__more-dropdown')?.contains(event.target as Node) && openMoreDropdown) {
				setOpenMoreDropdown(false);
			}
		}
	});

	const classItemActive = (value: string) =>
		classNames('reload-drawer__item', {
			'reload-drawer__item--active': value === refreshOption,
		});

	const Loading = () => {
		return (
			<div className="p2p-mobile-screen-p2p-list__body__loading">
				<LoadingGif />
			</div>
		);
	};

	return (
		<div className="p2p-mobile-screen-p2p-list">
			<P2pNavBar />
			<RenderHeader />

			<div className="p2p-mobile-screen-p2p-list__body container-fluid">
				{ordersPublic.isLoading && <Loading />}

				{ordersPublic.ordersPublic.data.length === 0 ? (
					<div>{!ordersPublic.isLoading && <P2pEmpty />}</div>
				) : (
					<>
						{ordersPublic.ordersPublic.data.map((item, index) => {
							return (
								<P2pItemComponent
									infoOrderPublic={infoOrderPublic.infoPublicOrders}
									key={item.id}
									infoItem={item}
									balance={balanceToken.balance ? balanceToken.balance.balance : 0}
								/>
							);
						})}
					</>
				)}
			</div>

			<Drawer
				className="reload-drawer"
				height="200px"
				width="100vw"
				placement="bottom"
				onClose={() => setShowReloadDrawer(false)}
				visible={showReloadDrawer}
				zIndex={9999999}
				closable={false}
			>
				{refreshOptions.map((option, index) => {
					return (
						<div
							key={index}
							className={classItemActive(option)}
							onClick={() => {
								setRefreshOption(option);
								setShowReloadDrawer(false);
							}}
						>
							{!!Number(option) ? option + 's to refresh' : option}
						</div>
					);
				})}
			</Drawer>

			<P2pFilterDrawer
				title="Filter"
				infoOrder={infoOrderPublic.infoPublicOrders}
				show={showFilterDrawer}
				onClose={() => setShowFilterDrawer(false)}
				fiat={fiat}
				payment={payment}
				setFiat={setFiat}
				setPayment={setPayment}
				setOrderMin={setOrderMin}
				orderMin={orderMin}
			/>

			{!(ordersPublic.ordersPublic.data.length === 0) && !ordersPublic.isLoading && (
				<PaginationMobile
					forcePage={page - 1 || 0}
					toPage={(index: number) => {
						handleChangePage(index);
					}}
					pageCount={ordersPublic.ordersPublic.meta.pageCount || 1}
				/>
			)}
		</div>
	);
};
