import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import RightArrowIcon from 'assets/icons/p2p/arrow_right.svg';
import { LoadingGif } from 'components/LoadingGif';
import { localeDate } from 'helpers';
import moment from 'moment';
import { useInfoUser } from 'plugins/P2p/hooks';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { AiFillClockCircle } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { formatNumberP2p } from 'plugins/P2p/helper';
import { IInfoUser, IP2pPrivateTrade } from 'modules';

interface IShowNewTrades {
	listItem: IP2pPrivateTrade[];
	isLoading: boolean;
}

export const ShowNewTrades = ({ isLoading, listItem }: IShowNewTrades) => {
	const history = useHistory();
	const { infoUser } = useInfoUser();

	const rendererCountDown: CountdownRendererFn = ({ hours, minutes, seconds, completed }) => {
		const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
		const timeElm = (
			<>
				{format(hours)}:{format(minutes)}:{format(seconds)}
			</>
		);
		if (completed) {
			return <>END</>;
		} else {
			return timeElm;
		}
	};

	const classNameType = (type: 'buy' | 'sell') =>
		classNames({
			'p2p-component-nav-bar__orders-dropdown__dropdown__body__order__trading-type--buy': type === 'buy',
			'p2p-component-nav-bar__orders-dropdown__dropdown__body__order__trading-type--sell': type === 'sell',
		});

	const findNamePartner = (item: IP2pPrivateTrade) => {
		if (!infoUser || !item.owner || !item.partner) {
			return null;
		}

		let name;
		if (infoUser.id === item.owner.id) {
			name = item.partner.fullName;
		} else {
			name = item.owner.fullName;
		}

		return <div className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__advertiser-name">{name}</div>;
	};

	const RenderItemNew = () => {
		if (isLoading) {
			return (
				<div className="p2p-component-nav-bar__orders-dropdown__dropdown__body__loading">
					<LoadingGif />
				</div>
			);
		}

		const renderSideOfUser = (item: IP2pPrivateTrade, infoOfUser: IInfoUser) => {
			if (!infoOfUser?.memberId) {
				return null;
			}
			let side: 'buy' | 'sell';
			if (infoOfUser.memberId !== item.memberId) {
				side = item.type === 'buy' ? 'sell' : 'buy';
			} else {
				side = item.type;
			}

			return <div className={classNameType(side)}>{side === 'buy' ? 'Buy' : 'sell'}</div>;
		};

		return listItem?.length > 0 ? (
			<>
				{listItem.map(item => (
					<div
						className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order"
						onClick={() => history.push(`/p2p/order-detail/${item.id}`)}
						key={item.id}
					>
						<div className="d-flex flex-row align-items-center justify-content-between">
							<div className="d-flex flex-row align-items-center">
								{renderSideOfUser(item, infoUser as IInfoUser)}
								<div className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__currency">
									{item.fiat.toUpperCase()}
								</div>
							</div>
							<div className="d-flex flex-row align-items-center">
								<div className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__pending-payment">
									{item.status}
								</div>
								<img src={RightArrowIcon} className="ml-2" />
							</div>
						</div>
						<div className="mt-4 mb-4">
							<div className="d-flex flex-row align-items-center justify-content-between mb-2">
								<div>
									<span className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__label">
										Price
									</span>
									<span className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__value">
										{formatNumberP2p(item.price + '')} {item.fiat.toUpperCase()}
									</span>
								</div>
								<span className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__date-time">
									{localeDate(item.createdAt, 'fullDate')}
								</span>
							</div>
							<div className="d-flex flex-row align-items-center justify-content-between">
								<div>
									<span className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__label">
										Crypto amount
									</span>
									<span className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__value">
										{formatNumberP2p(item.amount + '')} {item.currency.toUpperCase()}
									</span>
								</div>
								<span className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__value">
									{formatNumberP2p(item.total + '')} {item.fiat.toUpperCase()}
								</span>
							</div>
						</div>
						<div className="d-flex flex-row align-items-center justify-content-between">
							<div className="d-flex flex-row align-items-center">
								<Avatar
									className="mr-3"
									style={{ backgroundColor: 'black', width: '1.5em', height: '1.5em' }}
									icon={<UserOutlined />}
								/>
								{findNamePartner(item)}
							</div>
							<div className="d-flex flex-row align-items-center">
								<AiFillClockCircle className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__clock" />
								<div className="p2p-component-nav-bar__orders-dropdown__dropdown__body__order__count-down">
									<Countdown
										intervalDelay={1000}
										date={+moment(item.createdAt).add(15, 'minutes')}
										renderer={rendererCountDown}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
			</>
		) : (
			<>
				<div className="w-100 text-center mt-4">
					<img
						src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
						alt="no-data"
						width="30%"
					/>
				</div>
				<div className="w-100 text-center mt-5">
					<h6>No more orders</h6>
				</div>
			</>
		);
	};

	return (
		<div className="p2p-component-nav-bar__orders-dropdown__dropdown">
			<div className="p2p-component-nav-bar__orders-dropdown__dropdown__header">
				<span className="p2p-component-nav-bar__orders-dropdown__dropdown__header__processing">Processing</span>
				<span
					className="p2p-component-nav-bar__orders-dropdown__dropdown__header__all-orders"
					onClick={() => {
						history.push('/p2p/my-trade');
					}}
				>
					All Orders
				</span>
			</div>
			<div className="p2p-component-nav-bar__orders-dropdown__dropdown__body">
				<RenderItemNew />
			</div>
		</div>
	);
};
