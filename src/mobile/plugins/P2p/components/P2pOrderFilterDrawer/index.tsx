import React, { FC } from 'react';
import { MyP2pDrawer } from '../MyP2pDrawer';
import { DatePicker, Select } from 'antd';
import { AiFillCaretDown } from 'react-icons/ai';
import moment from 'moment';
import { dateFormat, DEFAULT_VALUE_COIN, TFilterState, listState, TFilterStatus, listStatus } from 'plugins/P2p';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface P2pOrderFilterDrawerProps {
	title: string;
	show: boolean;
	onClose: () => void;
	typeFilter: TFilterState;
	statusFilter: TFilterStatus;
	handlerChooseState: (value: TFilterState) => void;
	handlerChooseStatus: (value: TFilterStatus) => void;
	coinFilter: string;
	handlerChooseCoin: (value: string) => void;
	dateFilter: { startDate: string; endDate: string };
	handlerDateFilter: (date: any) => void;
	handleResetFilter: () => void;
}

export const P2pOrderFilterDrawer: FC<P2pOrderFilterDrawerProps> = ({
	title,
	show,
	onClose,
	typeFilter,
	statusFilter,
	handlerChooseState,
	handlerChooseStatus,
	coinFilter,
	handlerChooseCoin,
	dateFilter,
	handlerDateFilter,
	handleResetFilter,
}) => {
	const { infoPublicOrders } = useP2pPublicInfos();
	const { currencySupported } = infoPublicOrders;

	const onHandleResetFilter = () => {
		handleResetFilter();
		onClose();
	};

	return (
		<MyP2pDrawer className="p2p-mobile-component-my-order-drawer" onClose={onClose} visible={show} title={title}>
			<div className="p2p-mobile-component-my-order-drawer__search">
				<div className="p2p-mobile-component-my-order-drawer__search__item">
					<div className="p2p-mobile-component-my-order-drawer__search__item__title">Coins</div>

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
								<Option key={currency.id} id={currency.id} value={currency.id}>
									{currency.id.toUpperCase()}
								</Option>
							);
						})}
					</Select>
				</div>
				<div className="p2p-mobile-component-my-order-drawer__search__item">
					<div className="p2p-mobile-component-my-order-drawer__search__item__title">Order Type</div>

					<Select
						defaultValue={'ALL'}
						onChange={(e: TFilterState) => {
							handlerChooseState(e);
						}}
						size="large"
						value={typeFilter}
						suffixIcon={<AiFillCaretDown />}
					>
						{listState.map(item => (
							<Option key={item} value={item}>
								{item.toUpperCase()}
							</Option>
						))}
					</Select>
				</div>

				<div className="p2p-mobile-component-my-order-drawer__search__item">
					<div className="p2p-mobile-component-my-order-drawer__search__item__title">Status</div>

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
				<div className="p2p-mobile-component-my-order-drawer__search__item">
					<div className="p2p-mobile-component-my-order-drawer__search__item__title">Date</div>

					<RangePicker
						size="large"
						value={
							dateFilter.startDate
								? [moment(dateFilter.startDate, dateFormat), moment(dateFilter.endDate, dateFormat)]
								: null
						}
						onChange={handlerDateFilter}
						format={dateFormat}
					/>
				</div>
			</div>
			<div className="p2p-mobile-component-my-order-drawer__group-btn">
				<button
					className="p2p-mobile-component-my-order-drawer__group-btn__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={onHandleResetFilter}
				>
					Reset Filter
				</button>
				<button
					className="p2p-mobile-component-my-order-drawer__group-btn__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--active"
					onClick={() => onClose()}
				>
					Search
				</button>
			</div>
		</MyP2pDrawer>
	);
};
