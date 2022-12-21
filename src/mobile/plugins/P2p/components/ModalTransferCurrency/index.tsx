import React, { useState } from 'react';
import { MyP2pDrawer } from '../MyP2pDrawer';
import { Checkbox } from 'antd';

interface IModalTransferCurrency {
	title: string;
	show: boolean;
	onClose: () => void;
	onConfirmation: () => void;
}
export const ModalTransferCurrency = ({ title, show, onClose, onConfirmation }: IModalTransferCurrency) => {
	const [confirmState, setConfirmState] = useState(false);

	return (
		<MyP2pDrawer
			className="p2p-mobile-component-transferred-currency"
			onClose={() => {
				setConfirmState(false);
				onClose();
			}}
			visible={show}
			title={title}
			height={'70vh'}
		>
			<div style={{ height: '100%', display: 'inline-block', overflow: 'scroll' }}>
				<p className="p2p-mobile-component-transferred-currency__confirmation-message">
					Please confirm that you have successfully received the money from the buyer through the following payment
					method before clicking on the "Received, notify Buyer" button.
				</p>

				<Checkbox
					className="mb-5"
					checked={confirmState}
					onChange={e => {
						setConfirmState(state => !state);
					}}
				>
					I received the money from the buyer and transferred the cryptocurrency to the buyer
				</Checkbox>
			</div>
			<div className="p2p-mobile-component-transferred-currency__button-group mt-3">
				<button
					className="p2p-mobile-component-transferred-currency__button-group__button pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={() => {
						setConfirmState(false);
						onClose();
					}}
				>
					Cancel
				</button>
				<button
					className={`p2p-mobile-component-transferred-currency__button-group__button pg-p2p-config-global__btn ${
						confirmState ? 'pg-p2p-config-global__btn--active' : ''
					}`}
					onClick={() => {
						setConfirmState(false);
						onClose();
						onConfirmation();
					}}
					disabled={!confirmState}
				>
					Confirm received
				</button>
			</div>
		</MyP2pDrawer>
	);
};
