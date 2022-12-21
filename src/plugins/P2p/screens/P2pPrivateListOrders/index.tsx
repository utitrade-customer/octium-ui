import { LoadingGif } from 'components/LoadingGif';
import { P2pNavBar } from 'plugins/P2p/components';
import { useP2pPublicInfos, usePaymentMethodsFetch } from 'plugins/P2p/hooks';
import { useP2PPrivateListOrders } from 'plugins/P2p/hooks';
import React, { useEffect, useState } from 'react';
import { ItemPrivateOrder } from './ItemPrivateOrder';
import { DatePicker, Select } from 'antd';
import { AiFillCaretDown } from 'react-icons/ai';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import P2pEmpty from 'plugins/P2p/components/P2pEmpty';
import { IPrivateOrderStatus } from 'modules';
import { getCachePrivateOrders, setCachePrivateOrders } from 'plugins/P2p/helper';

const { RangePicker } = DatePicker;
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

enum OrderTypes {
	BUY = 'Buy',
	SELL = 'Sell',
	ALL = 'ALL',
}
enum Status {
	Blocked = 'Blocked',
	Canceled = 'Canceled',
	Trading = 'Trading',
	Completed = 'Completed',
	ALL = 'ALL',
}

const DEFAULT_VALUE_COIN = 'ALL';

export const P2pPrivateListOrders = () => {
	const currencyCache = getCachePrivateOrders('currency');
	const typeCache = getCachePrivateOrders('type') as OrderTypes;
	const statusCache = getCachePrivateOrders('status') as Status;

	const [orderTypeFilter, setOrderTypeFilter] = useState<OrderTypes>(typeCache || OrderTypes.ALL);
	const [statusFilter, setStatusFilter] = useState<Status>(statusCache || Status.ALL);
	const [coinFilter, setCoinFilter] = useState<string>(currencyCache || DEFAULT_VALUE_COIN);
	const [dateFilter, setDateFilter] = useState<{
		startDate: string;
		endDate: string;
	}>({
		startDate: '',
		endDate: '',
	});
	const [page, setPage] = useState(1);
	const handleChangePage = (value: number) => {
		setPage(value + 1);
	};

	// store
	const { isLoading, listOrders, meta } = useP2PPrivateListOrders({
		page,
		currency: coinFilter.toLocaleLowerCase() === 'all' ? undefined : coinFilter.toLocaleLowerCase(),
		type: orderTypeFilter === OrderTypes.ALL ? undefined : (orderTypeFilter.toLocaleLowerCase() as 'buy' | 'sell'),
		status: statusFilter === Status.ALL ? undefined : (statusFilter.toLocaleLowerCase() as IPrivateOrderStatus),
		startAt: dateFilter.startDate,
		endAt: dateFilter.endDate,
	});
	const paymentMethods = usePaymentMethodsFetch();

	useEffect(() => {
		setPage(meta.page);
	}, [meta.page]);

	const { infoPublicOrders } = useP2pPublicInfos();
	const { currencySupported } = infoPublicOrders;

	const handlerDateFilter = (date: any) => {
		setDateFilter({
			startDate: date[0].format(dateFormat),
			endDate: date[1].format(dateFormat),
		});
	};
	const handleResetFilter = () => {
		setOrderTypeFilter(OrderTypes.ALL);
		setStatusFilter(Status.ALL);
		setCoinFilter(DEFAULT_VALUE_COIN);
		setDateFilter({ startDate: '', endDate: '' });

		setCachePrivateOrders('currency', DEFAULT_VALUE_COIN);
		setCachePrivateOrders('type', OrderTypes.ALL);
		setCachePrivateOrders('status', Status.ALL);
	};

	const handleChangeOrderType = (value: OrderTypes) => {
		setOrderTypeFilter(value);
		setCachePrivateOrders('type', value);
	};
	const handleChangeStatus = (value: Status) => {
		setStatusFilter(value);
		setCachePrivateOrders('status', value);
	};
	const handleChangeCurrency = (value: string) => {
		setCoinFilter(value);
		setCachePrivateOrders('currency', value);
	};

	const RenderLoading = () => {
		return (
			<div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
				<LoadingGif />
			</div>
		);
	};

	return (
		<div className="p2p-screen-my-ads">
			<P2pNavBar />
			<div className="p2p-screen-my-ads__header">
				<div className="container">
					<div className="p2p-screen-my-ads__header__search">
						<div className="p2p-screen-my-ads__header__search__item">
							<div className="p2p-screen-my-ads__header__search__item__title">Coins</div>

							<Select
								defaultValue={DEFAULT_VALUE_COIN}
								onChange={(e: string) => {
									handleChangeCurrency(e);
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
						<div className="p2p-screen-my-ads__header__search__item">
							<div className="p2p-screen-my-ads__header__search__item__title">Order Type</div>

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

						<div className="p2p-screen-my-ads__header__search__item">
							<div className="p2p-screen-my-ads__header__search__item__title">Status</div>

							<Select
								defaultValue={Status.ALL}
								onChange={(e: Status) => {
									handleChangeStatus(e);
								}}
								size="large"
								value={statusFilter}
								suffixIcon={<AiFillCaretDown />}
							>
								<Option value={Status.ALL}>{Status.ALL} </Option>
								<Option value={Status.Trading}>{Status.Trading} </Option>
								<Option value={Status.Canceled}>{Status.Canceled} </Option>
								<Option value={Status.Blocked}>{Status.Blocked} </Option>
							</Select>
						</div>
						<div className="p2p-screen-my-ads__header__search__item">
							<div className="p2p-screen-my-ads__header__search__item__title">Date</div>

							<RangePicker
								dropdownClassName="p2p-screen-my-ads__header__search__date-picker"
								value={
									dateFilter.startDate
										? [moment(dateFilter.startDate, dateFormat), moment(dateFilter.endDate, dateFormat)]
										: null
								}
								size="large"
								onChange={handlerDateFilter}
								format={dateFormat}
							/>
						</div>
						<div
							className="d-flex flex-row justify-content-between align-items-center mb-3"
							style={{ width: '100%' }}
						>
							<div className="p2p-screen-my-ads__header__search__reset" onClick={handleResetFilter}>
								Reset filter
							</div>
							<div className="p2p-screen-my-ads__header__search__add-history">Add History</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="p2p-screen-my-ads__body ">
					<div className="p2p-screen-my-ads__body__header">
						<div className="p2p-screen-my-ads__body__header--adv">
							<div>Ad Id</div>
							<div>Type</div>
							<div>Acsset/Fiat</div>
						</div>

						<div className="p2p-screen-my-ads__body__header--total">
							<div>Available Amount</div>
							<div>Completed Trade QTY.</div>
							<div>Limit</div>
						</div>

						<div className="p2p-screen-my-ads__body__header--price">
							<div>Price</div>
							<div>Exchange Rate</div>
						</div>

						<div className="p2p-screen-my-ads__body__header--pay">
							<div>Payment method</div>
						</div>

						<div className="p2p-screen-my-ads__body__header--time">
							<div>Last Updated</div>
							<div>Create Time</div>
						</div>
						<div className="p2p-screen-my-ads__body__header--status">
							<div>Status</div>
						</div>
						<div className="p2p-screen-my-ads__body__header--act">
							<div>Action</div>
						</div>
					</div>
					<div className="p2p-screen-my-ads__body__main  ">
						{(isLoading || paymentMethods.isLoading) && <RenderLoading />}

						{!isLoading && !paymentMethods.isLoading && listOrders.length === 0 ? (
							<P2pEmpty />
						) : (
							listOrders.map(order => (
								<div key={order.id}>
									<div className="p2p-screen-my-ads__body__item p2p-screen-my-ads__body__item__main ">
										<ItemPrivateOrder item={order} />
									</div>
									<hr />
								</div>
							))
						)}
					</div>

					{!isLoading && !paymentMethods.isLoading && listOrders.length > 0 && (
						<div className="p2p-screen-my-ads__body__pagination">
							<div id="udon-p2p-list__pagination">
								<ReactPaginate
									previousLabel={'<'}
									nextLabel={'>'}
									breakLabel={'...'}
									breakClassName={'break-me'}
									pageCount={meta.pageCount}
									marginPagesDisplayed={2}
									pageRangeDisplayed={5}
									onPageChange={page => handleChangePage(page.selected)}
									containerClassName={'pagination'}
									activeClassName={'active'}
									forcePage={page - 1}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
