import { Modal } from 'antd';
import React from 'react';
import NoticeIcon from 'assets/icons/p2p/notice.svg';
import { PostOrderState } from 'plugins/P2p/screens/P2pPostOrder';
import { IPaymentMethod, PaymentSupported } from 'modules';
import { formatNumberP2p } from 'plugins/P2p/helper';
import classNames from 'classnames';

interface OrderPostConfirmationModalProps {
	isModalVisible: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	postOrder: PostOrderState;
	paymentMethods: PaymentSupported[];
	listPayments: IPaymentMethod[];
}

export const OrderPostConfirmationModal = (props: OrderPostConfirmationModalProps) => {
	const { isModalVisible = false, postOrder, paymentMethods, handleOk, handleCancel, listPayments } = props;

	const renderInformation = (label: string, content: string) => {
		return (
			<div className="p2p-component-order-post-confirmation-modal__information">
				<div className="p2p-component-order-post-confirmation-modal__information__label">{label}</div>
				<div className="p2p-component-order-post-confirmation-modal__information__value">{content}</div>
			</div>
		);
	};

	const classNameActiveBtn = classNames(`p2p-component-order-post-confirmation-modal__button-group__button`, {
		'pg-p2p-config-global__btn pg-p2p-config-global__btn--active': true,
		// 'pg-p2p-config-global__btn pg-p2p-config-global__btn--disable': isHaving,
	});

	const RenderListNamePayment = () => {
		const payments = postOrder.payments;
		if (!payments) {
			return <></>;
		}

		return (
			<>
				{listPayments.reduce((prev: JSX.Element[], current) => {
					if (payments.includes(current.id)) {
						const found = paymentMethods.find(item => item.id === current.paymentConfig);
						found &&
							prev.push(
								<div key={current.id} className="p2p-component-order-post-confirmation-modal__information__value">
									{found?.name}
								</div>,
							);
						return prev;
					}
					return prev;
				}, [])}
			</>
		);
	};
	return (
		<Modal
			className="p2p-component-order-post-confirmation-modal"
			title="Basic Modal"
			visible={isModalVisible}
			onOk={handleOk}
			onCancel={handleCancel}
		>
			{postOrder && postOrder.type && postOrder.currency && postOrder.fiat && (
				<>
					<div style={{ display: 'flex' }}>
						<h3 style={{ margin: 'auto', fontWeight: 500 }}>Confirm</h3>
					</div>
					<div className="p2p-component-order-post-confirmation-modal__notice">
						<img src={NoticeIcon} />
						<div>After publishing the {postOrder.type.toUpperCase()} Post the trading assets will be frozen.</div>
					</div>
					<div style={{ display: 'grid', gridTemplateColumns: '14em 11em 11em', gap: '2.5em' }}>
						<div className="p2p-component-order-post-confirmation-modal__information">
							<div className="p2p-component-order-post-confirmation-modal__information__label">Type</div>
							<div
								className={`p2p-component-order-post-confirmation-modal__information__trading-type${
									postOrder.type.toLowerCase() === 'buy' ? '--buy' : '--sell'
								}`}
							>
								{postOrder.type.toUpperCase()}
							</div>
						</div>
						{renderInformation('Asset', postOrder.currency.toUpperCase() ?? '')}
						{renderInformation('Currency', postOrder.fiat.toUpperCase() ?? '')}
						{renderInformation(
							'Price',
							`${formatNumberP2p(postOrder.price + '')} ${postOrder.fiat.toUpperCase()}` ?? '',
						)}
						{/* {postOrder.priceType?.toLowerCase() === 'floating' &&
					renderInformation(
						'Floating Price Margin',
						formatNumberP2p(postOrder.price_floating_margin?.toString() ?? '') + '%' ?? '',
					)} */}

						{/* {renderInformation('Fixed', `${postOrder.price} ${postOrder.currency.toUpperCase()}`)} */}
					</div>
					<div style={{ marginTop: '2.5em' }} className="d-flex">
						<div className="flex-grow-1">
							{renderInformation(
								'Order Limit',
								`${formatNumberP2p(
									postOrder.orderMin?.toString() ?? '',
								)} ${postOrder.fiat.toUpperCase()} ~ ${formatNumberP2p(
									postOrder.orderMax?.toString() ?? '',
								)} ${postOrder.fiat.toUpperCase()}`,
							)}
						</div>

						<div className="flex-grow-1">
							{renderInformation(
								'Total Trading Amount',
								`${formatNumberP2p(postOrder.volume + '')} ${postOrder.currency.toUpperCase()}`,
							)}
						</div>
					</div>
					<hr />
					<div className="mb-4 mt-4">
						{(postOrder.requireRegistered?.toString() || postOrder.minHoldBtc?.toString()) && (
							<div className="p2p-component-order-post-confirmation-modal__information">
								{/* <div className="p2p-component-order-post-confirmation-modal__information__label">Counterparty Conditions</div>
					<div className="p2p-component-order-post-confirmation-modal__information__value">Completed KYC</div> */}
								{postOrder.requireRegistered?.toString() && (
									<div className="p2p-component-order-post-confirmation-modal__information__value">
										Registered {formatNumberP2p(postOrder.requireRegistered)} day(s) ago
									</div>
								)}
								{postOrder.minHoldBtc?.toString() && (
									<div className="p2p-component-order-post-confirmation-modal__information__value">
										Holdings more than {formatNumberP2p(postOrder.minHoldBtc)} BTC
									</div>
								)}
							</div>
						)}
					</div>
					<hr />
					<div className="mb-4 mt-4">
						<div className="d-flex flex-row align-items-start">
							<div className="flex-grow-1 p2p-component-order-post-confirmation-modal__information">
								<div className="p2p-component-order-post-confirmation-modal__information__label">
									Payment Method
								</div>
								<RenderListNamePayment />
							</div>
							<div className="flex-grow-1">
								{renderInformation('Payment Time Limit', `${postOrder.minutesTimeLimit} min`)}
							</div>
						</div>

						<div className="p2p-component-order-post-confirmation-modal__button-group mt-3">
							<button
								className="p2p-component-order-post-confirmation-modal__button-group__button pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
								onClick={() => {
									handleCancel();
								}}
							>
								Cancel
							</button>
							<button
								className={classNameActiveBtn}
								onClick={() => {
									handleOk();
								}}
							>
								Confirm to post
							</button>
						</div>
					</div>
				</>
			)}
		</Modal>
	);
};
