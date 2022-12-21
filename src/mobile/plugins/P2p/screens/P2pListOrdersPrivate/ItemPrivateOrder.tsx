import { Button, Modal } from 'antd';
import { IP2PPrivateOrder, p2pPrivateOrdersClosed, PaymentSupported } from 'modules';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CoinIcon } from 'assets/icons/p2p';
import { formatNumber } from 'helpers';

interface IItemPrivateOrder {
	item: IP2PPrivateOrder;
	paymentSupported: PaymentSupported[];
}

export const ItemPrivateOrder = (props: IItemPrivateOrder) => {
	const { item, paymentSupported } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { id, type, price, fiat, currency, orderMin, payments, orderMax, originVolume, status } = item;

	const dispatch = useDispatch();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		dispatch(p2pPrivateOrdersClosed({ id }));
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const findNamePaymentMethods = (id: number) => paymentSupported.find(item => item.id === id)?.name;

	return (
		<>
			<Modal title="Basic Modal" visible={isModalVisible} onCancel={handleCancel}>
				<h3>Do you want to close this ad</h3>

				<div>
					<Button onClick={handleOk}>Yes</Button>
					<Button onClick={handleCancel}>No</Button>
				</div>
			</Modal>
			<div className="p2p-item-my-order-mobile">
				<div className="p2p-item-my-order-mobile__header">
					<div className="p2p-item-my-order-mobile__header__left-container">
						<CoinIcon className="p2p-item-my-order-mobile__header__left-container__icon" />
						<div className="p2p-item-my-order-mobile__header__left-container__name">Id : {id}</div>
					</div>
					<div className="p2p-item-my-order-mobile__header__right-container">
						<span className="p2p-item-my-order-mobile__header__right-container__status">{status.toUpperCase()}</span>
						<span className="p2p-item-my-order-mobile__header__right-container__type">{type.toUpperCase()}</span>
						<span className="p2p-item-my-order-mobile__header__right-container__pair">
							{currency.toUpperCase()}/{fiat.toUpperCase()}
						</span>
					</div>
				</div>
				<div className="p2p-item-my-order-mobile__body">
					<div className="p2p-item-my-order-mobile__body__left-container">
						<div className="p2p-item-my-order-mobile__body__left-container__price">Price</div>
						<div className="p2p-item-my-order-mobile__body__left-container__number-price">
							<div className="p2p-item-my-order-mobile__body__left-container__number-price__value">
								{formatNumber(price.toString())}
							</div>
							<div className="p2p-item-my-order-mobile__body__left-container__number-price__unit">
								{fiat.toUpperCase()}
							</div>
						</div>
						<div className="p2p-item-my-order-mobile__body__left-container__available">
							<div className="p2p-item-my-order-mobile__body__left-container__available__title">Available</div>
							<div className="p2p-item-my-order-mobile__body__left-container__available__value">
								{formatNumber(originVolume.toString())} {currency.toUpperCase()}
							</div>
						</div>
						<div className="p2p-item-my-order-mobile__body__left-container__limit">
							<div className="p2p-item-my-order-mobile__body__left-container__limit__title">Limit</div>
							<div className="p2p-item-my-order-mobile__body__left-container__limit__value">
								{fiat.toUpperCase()} {formatNumber(orderMin.toString())} - {fiat.toUpperCase()}{' '}
								{formatNumber(orderMax.toString())}
							</div>
						</div>

						{payments.map((idPayment, index) => (
							<div key={index} className="p2p-item-my-order-mobile__body__left-container__revolue">
								{findNamePaymentMethods(idPayment.paymentConfig)}
							</div>
						))}
					</div>
					<div className="p2p-item-my-order-mobile__body__right-container">
						{false && <button className="p2p-item-my-order-mobile__body__right-container__btn  ">Share</button>}

						{status !== 'canceled' && (
							<button
								onClick={showModal}
								className="p2p-item-my-order-mobile__body__right-container__btn p2p-item-my-order-mobile__body__right-container__btn--cancel"
							>
								Closed
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
