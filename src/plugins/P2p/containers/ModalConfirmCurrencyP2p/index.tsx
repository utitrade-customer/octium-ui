import { Modal } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface ModalConfirmP2PProps {
	title: string;
	show: boolean;
	closePopUp: () => void;
	onConfirm: () => void;
}

export const ModalConfirmCurrencyP2p = (props: ModalConfirmP2PProps) => {
	const { show, closePopUp, onConfirm, title } = props;
	const [isAllow, setIsAllow] = useState(false);

	var modal = document.getElementById('p2p-container-confirmation-popup-transfer-currency-modal');
	window.onclick = function (event) {
		if (event.target == modal) {
			if (modal !== null) {
				closePopUp();
			}
		}
	};
	const classActiveBtnConfirm = classNames(
		'p2p-container-confirmation-popup-transfer-currency-modal__content__box-btn__confirm pg-p2p-config-global__btn',
		{
			'pg-p2p-config-global__btn--active': isAllow,
			'pg-p2p-config-global__btn--disable': !isAllow,
		},
	);

	return (
		<Modal closable={false} visible={show}>
			<div className="p2p-container-confirmation-popup-transfer-currency-modal__content__title">{title}</div>

			<div className="p2p-container-confirmation-popup-transfer-currency-modal__content__desc">
				Please confirm that you have successfully received the money from the buyer through the following payment method
				before clicking on the "Received, notify Buyer" button.
			</div>

			<div className="p2p-container-confirmation-popup-transfer-currency-modal__content__box-allow">
				<div className="p2p-container-confirmation-popup-transfer-currency-modal__content__box-allow__check-box">
					<div
						className="p2p-container-confirmation-popup-transfer-currency-modal__content__box-allow__check-box__custom-checkbox"
						onClick={() => setIsAllow(!isAllow)}
					>
						{isAllow ? (
							<FaCheck className="p2p-container-confirmation-popup-transfer-currency-modal__content__box-allow__check-box__custom-checkbox__icon" />
						) : (
							<></>
						)}
					</div>
				</div>
				<div className="p2p-container-confirmation-popup-transfer-currency-modal__content__box-allow__desc">
					I received the money from the buyer and transferred the cryptocurrency to the buyer
				</div>
			</div>

			<div className="p2p-container-confirmation-popup-transfer-currency-modal__content__box-btn mb-2">
				<div
					className="p2p-container-confirmation-popup-transfer-currency-modal__content__box-btn__cancel pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={() => closePopUp()}
				>
					Cannel
				</div>
				<button className={classActiveBtnConfirm} disabled={!isAllow} onClick={onConfirm}>
					Confirm received
				</button>
			</div>
		</Modal>
	);
};
