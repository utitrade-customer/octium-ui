import React, { FC, useState } from 'react';
import { MyP2pDrawer } from '../MyP2pDrawer';
import { RiErrorWarningFill } from 'react-icons/ri';
import { Checkbox } from 'antd';
import { IPaymentMethod, PaymentSupported } from 'modules';
import { formatLongText } from 'plugins/P2p/helper';

interface TransferredConfirmationModalBottomSheetProps {
	title: string;
	show: boolean;
	onClose: () => void;
	onConfirmation: () => void;
	paymentMethod: IPaymentMethod;
	paymentConfig: PaymentSupported;
}

export const TransferredConfirmationModalBottomSheet: FC<TransferredConfirmationModalBottomSheetProps> = ({
	title,
	show,
	onClose,
	onConfirmation,
	paymentMethod,
	paymentConfig,
}) => {
	const [confirmState, setConfirmState] = useState(false);
	const renderBankInformation = (label: string, content: string) => {
		return (
			<div className="d-flex flex-row justify-content-between mb-1 mt-1">
				<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__bank-information__label">
					{label}
				</div>
				<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__bank-information__value">
					{content}
				</div>
			</div>
		);
	};
	return (
		<MyP2pDrawer
			className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet"
			onClose={() => {
				setConfirmState(false);
				onClose();
			}}
			visible={show}
			title={title}
			height={'70vh'}
		>
			<div style={{ height: '100%', display: 'inline-block', overflow: 'scroll' }}>
				<p className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__confirmation-message">
					Please confirm that you have successfully transferred the money to the seller through the following payment
					method before clicking on the "Transferred, notify seller" button.
				</p>
				<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__bank-information">
					<div className="d-flex flex-row align-items-center mb-3">
						<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__bank-information__prefix"></div>
						<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__bank-information__name">
							{paymentConfig.name}
						</div>
					</div>
					<div className="d-flex flex-column justify-content-between">
						{paymentConfig.fields.map((e, index) => {
							return (
								e.type !== 'image' &&
								paymentMethod.fields[index]?.value &&
								renderBankInformation(e.label, formatLongText(paymentMethod.fields[index].value, 'right', 20))
							);
						})}
					</div>
				</div>

				<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__tip">
					<RiErrorWarningFill className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__tip__icon" />
					<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__tip__content">
						<span>Tip:</span> I understand that I must use the selected payment platform to complete the transfer
						myself. CrytoXX will not automatically transfer the payment on my behalf.
					</div>
				</div>
				<Checkbox
					className="mb-5"
					checked={confirmState}
					onChange={e => {
						setConfirmState(state => !state);
					}}
				>
					I have made payment from my real-time verified payment account consistent with my registered name on Octium
				</Checkbox>
			</div>
			<div className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__button-group mt-3">
				<button
					className="p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__button-group__button pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={() => {
						setConfirmState(false);
						onClose();
					}}
				>
					Cancel
				</button>
				<button
					className={`p2p-mobile-component-transferred-confirmation-modal-bottom-sheet__button-group__button pg-p2p-config-global__btn ${
						confirmState ? 'pg-p2p-config-global__btn--active' : ''
					}`}
					onClick={() => {
						setConfirmState(false);
						onClose();
						onConfirmation();
					}}
					disabled={!confirmState}
				>
					Confirm payment
				</button>
			</div>
		</MyP2pDrawer>
	);
};
