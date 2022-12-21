import React, { useState } from 'react';
import { Modal, Radio, Button } from 'antd';
import classNames from 'classnames';
import { RiErrorWarningFill } from 'react-icons/ri';

interface OrderCancelModalProps {
	title: string;
	isModalVisible: boolean;
	handleOk: () => void;
	handleCancel: () => void;
}

export const OrderCancelModal = (props: OrderCancelModalProps) => {
	const { isModalVisible = false, handleOk, handleCancel, title } = props;

	const [confirmState, setConfirmState] = useState(false);
	const [cancelReason, setCancelReason] = useState('');

	const renderCancelReasonOption = (content: string) => {
		return (
			<Radio
				onChange={e => {
					setConfirmState(true);
					setCancelReason(content);
				}}
				value={content}
			>
				{content}
			</Radio>
		);
	};

	const classBtnActive = classNames('p2p-component-order-cancel-modal__button-group__button pg-p2p-config-global__btn', {
		'pg-p2p-config-global__btn--active': confirmState,
		'pg-p2p-config-global__btn--disable': !confirmState,
	});
	return (
		<Modal
			className="p2p-component-order-cancel-modal"
			title={title}
			visible={isModalVisible}
			onOk={handleOk}
			onCancel={handleCancel}
		>
			<h3 className="p2p-component-order-cancel-modal__header__title mb-5">Cancel Order</h3>
			<div className="p2p-component-order-cancel-modal__body">
				<div className="p2p-component-order-cancel-modal__body__tips">
					<div className="d-flex flex-row align-items-center">
						<RiErrorWarningFill className="p2p-component-order-cancel-modal__body__tips__icon" />
						<div className="p2p-component-order-cancel-modal__body__tips__content__title">Tips</div>
					</div>
					<div className="p2p-component-order-cancel-modal__body__tips__content">
						<ol className="p2p-component-order-cancel-modal__body__tips__content__list">
							<li>If you have already paid the seller, please do not cancel the order.</li>
							<li>
								If the seller does not reply to chat within 15 mins, you will be unaccountable for this order's
								cancellation. It will not affect your completion rate. You can make up to{' '}
								<span className="p2p-component-order-cancel-modal__body__tips__content__emphasizing">
									5 unaccountable cancellations
								</span>{' '}
								in a day.
							</li>
							<li>
								Your account will be SUSPENDED for the day if you exceed{' '}
								<span className="p2p-component-order-cancel-modal__body__tips__content__emphasizing">
									{' '}
									3 accountable cancellations
								</span>{' '}
								in a day.
							</li>
						</ol>
					</div>
				</div>
				<div className="p2p-component-order-cancel-modal__body__cancel-reasons">
					<h5 className="p2p-component-order-cancel-modal__body__cancel-reasons__title">
						Why do you want to cancel the order?
					</h5>
					<Radio.Group value={cancelReason} className="mb-2">
						<div className="d-flex flex-column">
							{renderCancelReasonOption('I do not want to trade any more')}
							{renderCancelReasonOption(
								"I do not meet the requirements of the advertiser's trading terms and condition",
							)}
							{renderCancelReasonOption('Seller is asking for extra fee')}
							{renderCancelReasonOption("Problem with seller's payment method result in unsuccessful payments")}
							{renderCancelReasonOption('Other reasons')}
						</div>
					</Radio.Group>
				</div>
			</div>
			<div className="p2p-component-order-cancel-modal__button-group mt-3">
				<Button
					className="p2p-component-order-cancel-modal__button-group__button pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={() => {
						setConfirmState(false);
						setCancelReason('');
						handleCancel();
					}}
				>
					Cancel
				</Button>
				<Button
					className={classBtnActive}
					onClick={() => {
						setConfirmState(false);
						setCancelReason('');
						handleOk();
					}}
					disabled={!confirmState || cancelReason.length === 0}
				>
					Confirm
				</Button>
			</div>
		</Modal>
	);
};
