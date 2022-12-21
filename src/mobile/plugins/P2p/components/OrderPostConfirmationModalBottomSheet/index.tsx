import React, { FC } from 'react';
import { MyP2pDrawer } from '../MyP2pDrawer';
import NoticeIcon from 'assets/icons/p2p/notice.svg';
import { PostOrderState } from 'plugins/P2p';
import { IPaymentMethod, PaymentSupported } from 'modules';
import { formatNumber } from 'helpers';

interface OrderPostConfirmationModalBottomSheetProps {
	title: string;
	show: boolean;
	onClose: () => void;
	onConfirmation: () => void;
	postOrder: PostOrderState;
	paymentMethods: PaymentSupported[];
	listPayments: IPaymentMethod[];
}

export const OrderPostConfirmationModalBottomSheet: FC<OrderPostConfirmationModalBottomSheetProps> = ({
	title,
	show,
	onClose,
	onConfirmation,
	postOrder,
	paymentMethods,
	listPayments,
}) => {
	const renderInformation = (label: string, content: string) => {
		return (
			<div className="p2p-mobile-component-post-confirmation__body__information">
				<div className="p2p-mobile-component-post-confirmation__body__information__label">{label}</div>
				<div className="p2p-mobile-component-post-confirmation__body__information__value">{content}</div>
			</div>
		);
	};

	const RenderListNamePayment = () => {
		const payments = postOrder.payments;
		if (!payments) {
			return <></>;
		}

		return (
			<div>
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
			</div>
		);
	};

	return (
		<MyP2pDrawer
			className="p2p-mobile-component-post-confirmation"
			onClose={() => {
				onClose();
			}}
			visible={show}
			title={title}
			height={'80vh'}
		>
			<div className="p2p-mobile-component-post-confirmation__body">
				<div className="p2p-mobile-component-post-confirmation__body__notice">
					<img src={NoticeIcon} className="mr-3" />
					<div>After publishing the SELL Post the trading assets will be frozen.</div>
				</div>

				<div className="p2p-mobile-component-post-confirmation__body__information">
					<div className="p2p-mobile-component-post-confirmation__body__information__label">Type</div>
					<div
						className={`p2p-mobile-component-post-confirmation__body__information__trading-type${
							postOrder.type?.toLowerCase() === 'buy' ? '--buy' : '--sell'
						}`}
					>
						{postOrder.type?.toUpperCase()}
					</div>
				</div>
				{renderInformation('Asset', postOrder.currency?.toUpperCase() ?? '')}
				{renderInformation('Currency', postOrder.fiat?.toUpperCase() ?? '')}
				{renderInformation('Price', `${postOrder.price} ${postOrder.fiat?.toUpperCase()}` ?? '')}
				{/* {postOrder.priceType?.toLowerCase() === 'floating' &&
					renderInformation(
						'Floating Price Margin',
						formatNumber(postOrder.price_floating_margin?.toString() ?? '') + '%' ?? '',
					)} */}

				{renderInformation('Fixed', `${postOrder.price} ${postOrder.fiat?.toUpperCase()}`)}
				{renderInformation(
					'Order Limit',
					`${formatNumber(postOrder.orderMin?.toString() ?? '')} ${postOrder.fiat?.toUpperCase()} ~ ${formatNumber(
						postOrder.orderMax?.toString() ?? '',
					)} ${postOrder.fiat?.toUpperCase()}`,
				)}
				{renderInformation('Total Trading Amount', `${postOrder.volume} ${postOrder.currency?.toUpperCase()}`)}

				<hr />
				<div className="p2p-mobile-component-post-confirmation__body__information">
					<div className="p2p-mobile-component-post-confirmation__body__information__label">
						Counterparty Conditions
					</div>
					<div>
						<div className="p2p-mobile-component-post-confirmation__body__information__value">Completed KYC</div>
						{postOrder.requireRegistered?.toString() && (
							<div className="p2p-mobile-component-post-confirmation__body__information__value">
								Registered {postOrder.requireRegistered} day(s) ago
							</div>
						)}
						{postOrder.minHoldBtc?.toString() && (
							<div className="p2p-mobile-component-post-confirmation__body__information__value">
								Holdings more than {postOrder.minHoldBtc?.toPrecision(6)} BTC
							</div>
						)}
					</div>
				</div>

				<div className="p2p-mobile-component-post-confirmation__body__information align-items-start">
					<div className="p2p-mobile-component-post-confirmation__body__information__label">Payment Method</div>
					<RenderListNamePayment />
				</div>
				{renderInformation('Payment Time Limit', `${postOrder.minutesTimeLimit} min`)}
			</div>

			<div className="p2p-mobile-component-post-confirmation__button-group mt-3">
				<button
					className="p2p-mobile-component-post-confirmation__button-group__button pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={() => {
						onClose();
					}}
				>
					Cancel
				</button>
				<button
					className="p2p-mobile-component-post-confirmation__button-group__button pg-p2p-config-global__btn pg-p2p-config-global__btn--active"
					onClick={() => {
						onClose();
						onConfirmation();
					}}
				>
					Confirm to post
				</button>
			</div>
		</MyP2pDrawer>
	);
};
