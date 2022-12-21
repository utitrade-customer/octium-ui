import React, { FC, useState } from 'react';
import { MyP2pDrawer } from '../MyP2pDrawer';
import { RiErrorWarningFill } from 'react-icons/ri';
import { Radio } from 'antd';
import classNames from 'classnames';

interface CancelConfirmationModalBottomSheetProps {
	title: string;
	show: boolean;
	onClose: () => void;
	onConfirmation: () => void;
}

export const CancelConfirmationModalBottomSheet: FC<CancelConfirmationModalBottomSheetProps> = ({
	title,
	show,
	onClose,
	onConfirmation,
}) => {
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

	const classBtnActive = classNames('p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__button-group__button', {
		'p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__button-group__button--active': confirmState,
		'p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__button-group__button--disable': !confirmState,
	});

	return (
		<MyP2pDrawer
			className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet"
			onClose={() => {
				setConfirmState(false);
				setCancelReason('');
				onClose();
			}}
			visible={show}
			title={title}
			height={'70vh'}
		>
			<div
				className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body"
				style={{ height: '100%', display: 'inline-block', overflow: 'scroll' }}
			>
				<div className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__tips">
					<div className="d-flex flex-row align-items-center">
						<RiErrorWarningFill className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__tips__icon" />
						<div className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__tips__content__title">
							Tips
						</div>
					</div>
					<div className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__tips__content">
						<ol className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__tips__content__list">
							<li>If you have already paid the seller, please do not cancel the order.</li>
							<li>
								If the seller does not reply to chat within 15 mins, you will be unaccountable for this order's
								cancellation. It will not affect your completion rate. You can make up to{' '}
								<span className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__tips__content__emphasizing">
									5 unaccountable cancellations
								</span>{' '}
								in a day.
							</li>
							<li>
								Your account will be SUSPENDED for the day if you exceed{' '}
								<span className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__tips__content__emphasizing">
									{' '}
									3 accountable cancellations
								</span>{' '}
								in a day.
							</li>
						</ol>
					</div>
				</div>
				<div className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__cancel-reasons">
					<h5 className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__body__cancel-reasons__title">
						Why do you want to cancel the order?
					</h5>
					<Radio.Group value={cancelReason} className="mb-5">
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

			<div className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__button-group mt-3">
				<button
					className="p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__button-group__button p2p-mobile-component-cancel-confirmation-modal-bottom-sheet__button-group__button--cancel"
					onClick={() => {
						setConfirmState(false);
						setCancelReason('');
						onClose();
					}}
				>
					Cancel
				</button>
				<button
					className={classBtnActive}
					onClick={() => {
						setConfirmState(false);
						setCancelReason('');
						onClose();
						onConfirmation();
					}}
					disabled={!confirmState || cancelReason.length === 0}
				>
					Confirm cancel the order
				</button>
			</div>
		</MyP2pDrawer>
	);
};
