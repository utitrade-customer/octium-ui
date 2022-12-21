import { DatePicker, Select, Tooltip } from 'antd';
import { alertPush, IInfoUser, IP2pPrivateTrade, TPrivateTradesState, TPrivateTradesStatus } from 'modules';
import React, { useEffect, useState } from 'react';
import { AiFillCaretDown, AiFillStar } from 'react-icons/ai';
import { IoIosCopy } from 'react-icons/io';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { P2pNavBar } from 'plugins/P2p/components';
import P2pEmpty from 'plugins/P2p/components/P2pEmpty';
import classNames from 'classnames';
import P2pDownloadIcon from 'assets/icons/p2p/download.svg';
import P2pRefreshIcon from 'assets/icons/p2p/refresh.svg';
import { useInfoUser, useP2pMyTrades, useP2pPublicInfos } from 'plugins/P2p/hooks';
import { LoadingGif } from 'components/LoadingGif';
import { localeDate } from 'helpers';
import { formatLongText, formatNumberP2p, getInfoCacheMyTrade, setInfoCacheMyTrade } from 'plugins/P2p/helper';
import { useHistory } from 'react-router';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const dateFormat = 'YYYY/MM/DD';

export enum Tabs {
	PROCESSING = 'Processing',
	ALL = 'All',
}

export const DEFAULT_VALUE_COIN = 'ALL';

export type TFilterState = TPrivateTradesState | 'ALL';

export const listState = ['ALL', 'pending', 'completed'];

export type TFilterStatus = TPrivateTradesStatus | 'ALL';

export const listStatus = ['all', 'unpaid', 'paid', 'appeal pending', 'completed', 'canceled'];

enum OrderTypes {
	BUY = 'Buy',
	SELL = 'Sell',
	ALL = 'ALL',
}

export const P2pMyTrade = () => {
	const coinCache = getInfoCacheMyTrade('coin');
	const stateCache = getInfoCacheMyTrade('state') as TFilterState;
	const statusCache = getInfoCacheMyTrade('status') as TFilterStatus;
	const typeCache = getInfoCacheMyTrade('type') as OrderTypes;

	const [tab, setTab] = useState<Tabs>(Tabs.ALL);
	const [typeFilter, setTypeFilter] = useState<TFilterState>(stateCache || 'ALL');
	const [statusFilter, setStatusFilter] = useState<TFilterStatus>(statusCache || 'ALL');
	const [orderTypeFilter, setOrderTypeFilter] = useState<OrderTypes>(typeCache || OrderTypes.ALL);
	const [coinFilter, setCoinFilter] = useState<string>(coinCache || DEFAULT_VALUE_COIN);
	const [dateFilter, setDateFilter] = useState<{
		startDate: string;
		endDate: string;
	}>({
		startDate: '',
		endDate: '',
	});
	const [page, setPage] = useState(1);
	const history = useHistory();

	const dispatch = useDispatch();
	const { infoPublicOrders } = useP2pPublicInfos();
	const { isLoading, myTrades } = useP2pMyTrades({
		currency: coinFilter === DEFAULT_VALUE_COIN ? undefined : coinFilter,
		page,
		type: orderTypeFilter === OrderTypes.ALL ? undefined : (orderTypeFilter.toLocaleLowerCase() as 'buy' | 'sell'),
		state: typeFilter.toLocaleLowerCase() === 'all' ? undefined : (typeFilter.toLocaleLowerCase() as TPrivateTradesState),
		status:
			statusFilter.toLocaleLowerCase() === 'all' ? undefined : (statusFilter.toLocaleLowerCase() as TPrivateTradesStatus),
		startAt: dateFilter.startDate,
		endAt: dateFilter.endDate,
	});
	const { infoUser } = useInfoUser();
	const { currencySupported } = infoPublicOrders;
	const { data, meta } = myTrades;

	useEffect(() => {
		setPage(meta.page);
	}, [meta.page]);

	const handleResetFilter = () => {
		setTypeFilter('ALL');
		setStatusFilter('ALL');
		setOrderTypeFilter(OrderTypes.ALL);
		setCoinFilter(DEFAULT_VALUE_COIN);
		setDateFilter({ startDate: '', endDate: '' });

		setInfoCacheMyTrade('coin', DEFAULT_VALUE_COIN);
		setInfoCacheMyTrade('state', 'ALL');
		setInfoCacheMyTrade('status', 'ALL');
		setInfoCacheMyTrade('type', OrderTypes.ALL);
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

	const handleChangeOrderType = (value: OrderTypes) => {
		setOrderTypeFilter(value);
		setInfoCacheMyTrade('type', value);
	};

	const handlerChooseCoin = (value: string) => {
		setCoinFilter(value);
		setInfoCacheMyTrade('coin', value);
	};

	// const handlerChooseState = (value: TFilterState) => {
	// 	setTypeFilter(value);
	// 	setInfoCacheMyTrade('state', value);
	// };

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
				className={`p2p-screen-my-trade__body__box__show-type__title ${
					side === 'sell' ? 'p2p-screen-my-trade__body__box__show-type__title--sell' : ''
				}`}
			>
				{side === 'buy' ? 'Buy' : 'sell'}
				<span>{localeDate(item.createdAt, 'fullDate')}</span>
			</div>
		);
	};

	const renderTabs = () => {
		const tabName = 'p2p-screen-my-trade__header__tabs__tab';
		return (
			<div className="container p2p-screen-my-trade__header__tabs">
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

	const findNamePartner = (item: IP2pPrivateTrade) => {
		if (!infoUser || !item.owner || !item.partner) {
			return null;
		}

		let id, name;
		if (infoUser.id === item.owner.id) {
			id = item.partner.id;
			name = item.partner.fullName;
		} else {
			id = item.owner.id;
			name = item.owner.fullName;
		}

		return (
			<div
				onClick={() => history.push(`/p2p/profile/${id}`)}
				className="p2p-screen-my-trade__body__box__row__counterparts__name"
			>
				{formatLongText(name, 'right', 15)}
			</div>
		);
	};

	const RenderItems = () => {
		return (
			<>
				{isLoading && (
					<div className="p2p-screen-my-trade__body__box__loading">
						<LoadingGif />
					</div>
				)}

				{!isLoading && data.length > 0 && infoUser ? (
					<>
						{data.map((item, index) => (
							<div key={item.id}>
								<div className="p2p-screen-my-trade__body__box__show-type">
									{renderSideOfUser(item, infoUser as IInfoUser)}
									<div className="p2p-screen-my-trade__body__box__show-type__address">
										<span
											onClick={() => {
												history.push(`/p2p/order-detail/${item.id}`);
											}}
										>
											{item.numPaid}
										</span>{' '}
										<IoIosCopy onClick={() => copyTextToClipboard(item.numPaid)} />
									</div>
								</div>
								<div className="p2p-screen-my-trade__body__box__row" key={index}>
									<div className="p2p-screen-my-trade__body__box__row__item p2p-screen-my-trade__body__box__row__coin">
										<img
											src="https://i.pinimg.com/236x/ff/fc/ab/fffcabbd0ed5a8dbb33d6f25862fa3aa.jpg"
											alt=""
										/>
										<span>{item.currency.toUpperCase()}</span>
									</div>
									<div className="p2p-screen-my-trade__body__box__row__item p2p-screen-my-trade__body__box__row__fiat">
										{formatNumberP2p(item.total)} {item.fiat.toUpperCase()}
									</div>
									<div className="p2p-screen-my-trade__body__box__row__item p2p-screen-my-trade__body__box__row__price">
										{formatNumberP2p(item.price)} {item.fiat.toUpperCase()}
									</div>
									<div className="p2p-screen-my-trade__body__box__row__item p2p-screen-my-trade__body__box__row__crypto">
										{formatNumberP2p(item.amount)} {item.currency.toUpperCase()}
									</div>
									<div className="p2p-screen-my-trade__body__box__row__item p2p-screen-my-trade__body__box__row__counterparts">
										<div>
											{findNamePartner(item)}
											<div className="p2p-screen-my-trade__body__box__row__counterparts__star">
												{Array.from(Array(5)).map((_, index) => (
													<AiFillStar key={index} />
												))}
											</div>
										</div>
									</div>
									<div className="p2p-screen-my-trade__body__box__row__item">{item.status}</div>
									<div className="p2p-screen-my-trade__body__box__row__item p2p-screen-my-trade__body__box__row__operation">
										Contact
									</div>
								</div>
							</div>
						))}
					</>
				) : (
					<div className="p2p-screen-my-trade__body__box__empty">
						<P2pEmpty />
					</div>
				)}
			</>
		);
	};
	return (
		<div className="p2p-screen-my-trade">
			<P2pNavBar />

			<div className="p2p-screen-my-trade__header">
				{renderTabs()}
				{tab !== Tabs.PROCESSING && (
					<>
						<hr style={{ width: '100%', margin: '1em 0 2em' }} />
						<div className="container">
							<div className="p2p-screen-my-trade__header__search">
								<div className="p2p-screen-my-trade__header__search__item">
									<div className="p2p-screen-my-trade__header__search__item__title">Coins</div>

									<Select
										defaultValue={DEFAULT_VALUE_COIN}
										style={{ width: 120 }}
										onChange={(e: string) => {
											handlerChooseCoin(e);
										}}
										value={coinFilter}
										size="large"
										suffixIcon={<AiFillCaretDown />}
									>
										<Option value={DEFAULT_VALUE_COIN}>{DEFAULT_VALUE_COIN}</Option>
										{currencySupported.map(currency => {
											return (
												<Option key={currency.id} value={currency.id}>
													{currency.id.toUpperCase()}
												</Option>
											);
										})}
									</Select>
								</div>
								<div className="p2p-screen-my-trade__header__search__item">
									<div className="p2p-screen-my-trade__header__search__item__title">Order Type</div>

									<Select
										defaultValue={OrderTypes.ALL}
										onChange={(e: OrderTypes) => {
											handleChangeOrderType(e);
										}}
										size="large"
										value={orderTypeFilter}
										suffixIcon={<AiFillCaretDown />}
									>
										<Option value={OrderTypes.ALL}>{OrderTypes.ALL}</Option>
										<Option value={OrderTypes.BUY}>{OrderTypes.BUY}</Option>
										<Option value={OrderTypes.SELL}>{OrderTypes.SELL}</Option>
									</Select>
								</div>

								<div className="p2p-screen-my-trade__header__search__item">
									<div className="p2p-screen-my-trade__header__search__item__title">Status</div>

									<Select
										defaultValue={'ALL'}
										onChange={(e: TFilterStatus) => {
											handlerChooseStatus(e);
										}}
										size="large"
										value={statusFilter}
										suffixIcon={<AiFillCaretDown />}
									>
										{listStatus.map(item => {
											return (
												<Option key={item} value={item}>
													{item.toUpperCase()}
												</Option>
											);
										})}
									</Select>
								</div>
								<div className="p2p-screen-my-trade__header__search__item">
									<div className="p2p-screen-my-trade__header__search__item__title">Date</div>

									<RangePicker
										dropdownClassName="p2p-screen-my-trade__date-picker"
										value={
											dateFilter.startDate
												? [
														moment(dateFilter.startDate, dateFormat),
														moment(dateFilter.endDate, dateFormat),
												  ]
												: null
										}
										size="large"
										onChange={handlerDateFilter}
										format={dateFormat}
									/>
								</div>
								<div
									className="d-flex flex-row justify-content-between align-items-center mb-2"
									style={{ width: '100%' }}
								>
									<div className="p2p-screen-my-trade__header__search__reset" onClick={handleResetFilter}>
										Reset filter
									</div>
									<div className="d-flex flex-row align-items-center">
										<Tooltip placement="top" title={'Export order List'} trigger="hover">
											<div className="p2p-screen-my-trade__header__search__download-refresh-icons mr-2">
												<img src={P2pDownloadIcon} />
											</div>
										</Tooltip>
										<Tooltip placement="top" title={'View the export task process'} trigger="hover">
											<div className="p2p-screen-my-trade__header__search__download-refresh-icons">
												<img src={P2pRefreshIcon} />
											</div>
										</Tooltip>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>

			<div className="container">
				<div className="p2p-screen-my-trade__body">
					<div className="p2p-screen-my-trade__body__box">
						<div className="p2p-screen-my-trade__body__box__row mb-4">
							<div className="p2p-screen-my-trade__body__box__row__item">Type/Coin</div>
							<div className="p2p-screen-my-trade__body__box__row__item">Fiat amount</div>
							<div className="p2p-screen-my-trade__body__box__row__item">Price</div>
							<div className="p2p-screen-my-trade__body__box__row__item">Crypto amount</div>
							<div className="p2p-screen-my-trade__body__box__row__item">Counterparts</div>
							<div className="p2p-screen-my-trade__body__box__row__item">Status</div>
							<div className="p2p-screen-my-trade__body__box__row__item">Operation</div>
						</div>

						<RenderItems />
					</div>

					{!isLoading && data.length !== 0 && (
						<div className="p2p-screen-my-trade__body__pagination">
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
				</div>
			</div>
		</div>
	);
};
