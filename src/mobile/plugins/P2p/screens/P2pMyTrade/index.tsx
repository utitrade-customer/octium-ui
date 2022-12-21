import { alertPush, IInfoUser, IP2pPrivateTrade, TPrivateTradesState, TPrivateTradesStatus } from 'modules';
import React, { useEffect, useState } from 'react';
import { IoIosCopy } from 'react-icons/io';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { P2pNavBar } from '../../components';
import P2pEmpty from '../../components/P2pEmpty';
import classNames from 'classnames';
import P2pDownloadIcon from 'assets/icons/p2p/download.svg';
import P2pRefreshIcon from 'assets/icons/p2p/refresh.svg';
import P2pFilterIcon from 'assets/icons/p2p/filter.svg';
import { P2pOrderFilterDrawer } from '../../components/P2pOrderFilterDrawer';

import { dateFormat, Tabs, DEFAULT_VALUE_COIN, TFilterState, TFilterStatus } from 'plugins/P2p';
import { getInfoCacheMyTrade, setInfoCacheMyTrade } from 'plugins/P2p/helper';
import { useInfoUser, useP2pMyTrades } from 'plugins/P2p/hooks';
import { LoadingGif } from 'components/LoadingGif';
import { localeDate } from 'helpers';
import { useHistory } from 'react-router';

export const P2pMyTradeMobile = () => {
	const coinCache = getInfoCacheMyTrade('coin');
	const stateCache = getInfoCacheMyTrade('state') as TFilterState;
	const statusCache = getInfoCacheMyTrade('status') as TFilterStatus;

	const [tab, setTab] = useState<Tabs>(Tabs.ALL);
	const [typeFilter, setTypeFilter] = useState<TFilterState>(stateCache || 'ALL');
	const [statusFilter, setStatusFilter] = useState<TFilterStatus>(statusCache || 'ALL');
	const [coinFilter, setCoinFilter] = useState<string>(coinCache || DEFAULT_VALUE_COIN);
	const [dateFilter, setDateFilter] = useState<{
		startDate: string;
		endDate: string;
	}>({
		startDate: '',
		endDate: '',
	});
	const [page, setPage] = useState(1);
	const [showOrderFilterDrawer, setShowOrderFilterDrawer] = useState(false);
	const history = useHistory();
	const { infoUser } = useInfoUser();

	const dispatch = useDispatch();
	const { isLoading, myTrades } = useP2pMyTrades({
		currency: coinFilter === DEFAULT_VALUE_COIN ? undefined : coinFilter,
		page,
		state: typeFilter.toLocaleLowerCase() === 'all' ? undefined : (typeFilter.toLocaleLowerCase() as TPrivateTradesState),
		status:
			statusFilter.toLocaleLowerCase() === 'all' ? undefined : (statusFilter.toLocaleLowerCase() as TPrivateTradesStatus),
		startAt: dateFilter.startDate,
		endAt: dateFilter.endDate,
	});

	const { data, meta } = myTrades;

	useEffect(() => {
		setPage(meta.page);
	}, [meta.page]);

	const handleResetFilter = () => {
		setTypeFilter('ALL');
		setStatusFilter('ALL');
		setCoinFilter(DEFAULT_VALUE_COIN);
		setDateFilter({ startDate: '', endDate: '' });

		setInfoCacheMyTrade('coin', DEFAULT_VALUE_COIN);
		setInfoCacheMyTrade('state', 'ALL');
		setInfoCacheMyTrade('status', 'ALL');
	};

	const handleChangePage = (value: number) => {
		setPage(value + 1);
	};

	const handlerDateFilter = (date: any) => {
		setDateFilter({
			startDate: date[0].format(dateFormat),
			endDate: date[1].format(dateFormat),
		});
	};

	const handlerChooseCoin = (value: string) => {
		setCoinFilter(value);
		setInfoCacheMyTrade('coin', value);
	};

	const handlerChooseState = (value: TFilterState) => {
		setTypeFilter(value);
		setInfoCacheMyTrade('state', value);
	};

	const handlerChooseStatus = (value: TFilterStatus) => {
		setStatusFilter(value);
		setInfoCacheMyTrade('status', value);
	};

	const onChangeTab = (value: Tabs) => {
		if (value === Tabs.PROCESSING) {
			setTab(Tabs.PROCESSING);
			setTypeFilter('pending');
			setInfoCacheMyTrade('state', 'pending');
		} else {
			setTab(Tabs.ALL);
			setTypeFilter('ALL');
			setInfoCacheMyTrade('state', 'ALL');
		}
	};

	const renderSideOfUser = (item: IP2pPrivateTrade, infoOfUser: IInfoUser) => {
		let side: 'buy' | 'sell';
		if (infoOfUser.memberId !== item.memberId) {
			side = item.type === 'buy' ? 'sell' : 'buy';
		} else {
			side = item.type;
		}

		return (
			<div
				className={`p2p-screen-mobile-my-trade__body__box__row__header__trading-type${
					item.type === 'buy' ? '--buy' : '--sell'
				}`}
			>
				{side === 'buy' ? 'Buy' : 'sell'}
			</div>
		);
	};

	const renderTabs = () => {
		const tabName = 'p2p-screen-mobile-my-trade__header__tabs__tab';
		return (
			<div className="p2p-screen-mobile-my-trade__header__tabs">
				<div
					className={classNames(tabName, { [`${tabName}--active`]: tab === Tabs.PROCESSING })}
					onClick={() => onChangeTab(Tabs.PROCESSING)}
					style={{ marginRight: '2em' }}
				>
					Processing
				</div>
				<div
					className={classNames(tabName, { [`${tabName}--active`]: tab === Tabs.ALL })}
					onClick={() => onChangeTab(Tabs.ALL)}
				>
					All Orders
				</div>
			</div>
		);
	};

	async function copyTextToClipboard(text: string) {
		dispatch(alertPush({ message: [`Copied successfully!`], type: 'success' }));
		return await navigator.clipboard.writeText(text);
	}

	const RenderItems = () => {
		if (isLoading) {
			return (
				<div className="p2p-screen-my-trade__body__box__loading">
					<LoadingGif />
				</div>
			);
		}

		return !isLoading && data.length > 0 && infoUser ? (
			<>
				{data.map((item, index) => (
					<div className="p2p-screen-mobile-my-trade__body__box__row" key={index}>
						<div className="p2p-screen-mobile-my-trade__body__box__row__header">
							{renderSideOfUser(item, infoUser as IInfoUser)}
							<div className="p2p-screen-mobile-my-trade__body__box__row__header__trading-coin">
								{item.currency.toUpperCase()}
							</div>
							<span>with</span>
							<div className="p2p-screen-mobile-my-trade__body__box__row__header__trading-coin">
								{item.fiat.toUpperCase()}
							</div>
						</div>

						<div className="p2p-screen-mobile-my-trade__body__box__row__body">
							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Created time </div>
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__content">
									{localeDate(item.createdAt, 'fullDate')}
								</div>
							</div>
							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Order number </div>
								<div className="d-flex flex-row align-items-center">
									<div
										className="p2p-screen-mobile-my-trade__body__box__row__body__item__content p2p-screen-mobile-my-trade__body__box__row__body__item__content--num-paid"
										style={{ cursor: 'pointer' }}
										onClick={() => {
											history.push(`/p2p/order-detail/${item.id}`);
										}}
									>
										{item.numPaid}
									</div>
									<IoIosCopy className="ml-1" onClick={() => copyTextToClipboard(item.numPaid)} />
								</div>
							</div>
							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Fiat amount</div>
								<div
									className="p2p-screen-mobile-my-trade__body__box__row__body__item__content"
									style={{ fontWeight: 600 }}
								>
									{item.total} {item.fiat.toUpperCase()}
								</div>
							</div>

							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Price</div>

								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__content">
									{item.price}
								</div>
							</div>
							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Crypto amount</div>

								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__content">
									{item.amount} {item.currency.toUpperCase()}
								</div>
							</div>
							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Counterparty</div>

								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__content">
									{item.owner.fullName}
								</div>
							</div>
							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Status</div>

								<div
									className="p2p-screen-mobile-my-trade__body__box__row__body__item__content"
									style={{ fontWeight: 600 }}
								>
									{item.status}
								</div>
							</div>
							<div className="p2p-screen-mobile-my-trade__body__box__row__body__item">
								<div className="p2p-screen-mobile-my-trade__body__box__row__body__item__title">Operation</div>

								<div
									className="p2p-screen-mobile-my-trade__body__box__row__body__item__content"
									style={{ color: 'rgb(var(--rgb-blue))', fontWeight: 600 }}
								>
									Contact
								</div>
							</div>
						</div>
					</div>
				))}
			</>
		) : (
			<div className="p2p-screen-mobile-my-trade__body__box__empty">
				<P2pEmpty />
			</div>
		);
	};

	return (
		<div className="p2p-screen-mobile-my-trade">
			<P2pNavBar showPoster={false} />

			<div className="p2p-screen-mobile-my-trade__header">
				<div className="container">
					<div className="p2p-screen-mobile-my-trade__header__search">
						{renderTabs()}

						{tab !== Tabs.PROCESSING && (
							<>
								<hr style={{ width: '100%', margin: '1em 0 1em' }} />
								<div
									className="d-flex flex-row justify-content-between align-items-center mb-2 mt-2"
									style={{ width: '100%' }}
								>
									<div className="d-flex flex-row align-items-center">
										<div className="p2p-screen-mobile-my-trade__header__download-refresh-icons mr-2">
											<img src={P2pDownloadIcon} />
										</div>
										<div className="p2p-screen-mobile-my-trade__header__download-refresh-icons">
											<img src={P2pRefreshIcon} />
										</div>
									</div>
									<div
										className="p2p-screen-mobile-my-trade__header__filter-icon"
										onClick={() => setShowOrderFilterDrawer(true)}
									>
										<img src={P2pFilterIcon} />
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="container">
				<div className="p2p-screen-mobile-my-trade__body">
					<div className="p2p-screen-mobile-my-trade__body__box">
						<RenderItems />
					</div>

					{!isLoading && data.length > 0 && (
						<div className="p2p-screen-mobile-my-trade__body__pagination">
							<ReactPaginate
								previousLabel={'<'}
								nextLabel={'>'}
								breakLabel={'...'}
								breakClassName={'break-me'}
								pageCount={meta.pageCount}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={page => handleChangePage(page.selected)}
								containerClassName={'td-pg-wallet__pagination'}
								activeClassName={'active'}
								forcePage={page - 1}
							/>
						</div>
					)}

					<P2pOrderFilterDrawer
						title={`Filter`}
						show={showOrderFilterDrawer}
						onClose={() => setShowOrderFilterDrawer(false)}
						coinFilter={coinFilter}
						handlerChooseCoin={handlerChooseCoin}
						handlerDateFilter={handlerDateFilter}
						dateFilter={dateFilter}
						handleResetFilter={handleResetFilter}
						handlerChooseState={handlerChooseState}
						handlerChooseStatus={handlerChooseStatus}
						statusFilter={statusFilter}
						typeFilter={typeFilter}
					/>
				</div>
			</div>
		</div>
	);
};
