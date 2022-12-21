import { Modal } from 'antd';
import classNames from 'classnames';
import { IPaymentMethod, PaymentSupported } from 'modules';
import { formatLongText } from 'plugins/P2p/helper';
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface ModalConfirmP2PProps {
	show: boolean;
	closePopUp: (close: boolean) => void;
	onConfirm: () => void;
	paymentConfig: PaymentSupported;
	paymentMethod: IPaymentMethod;
}

export const ModalConfirmP2P = (props: ModalConfirmP2PProps) => {
	const { show, closePopUp, onConfirm, paymentConfig, paymentMethod } = props;
	const [isAllow, setIsAllow] = useState(false);

	var modal = document.getElementById('p2p-container-confirmation-popup-modal');
	window.onclick = function (event) {
		if (event.target == modal) {
			if (modal !== null) {
				closePopUp(false);
			}
		}
	};
	// const classShow = classNames('p2p-container-confirmation-popup-modal');
	const classActiveBtnConfirm = classNames(
		'p2p-container-confirmation-popup-modal__content__box-btn__confirm pg-p2p-config-global__btn',
		{
			'pg-p2p-config-global__btn--active': isAllow,
			'pg-p2p-config-global__btn--disable': !isAllow,
		},
	);

	return (
		<Modal closable={false} visible={show}>
			<div className="p2p-container-confirmation-popup-modal__content__title">Payment Confirm</div>

			<div className="p2p-container-confirmation-popup-modal__content__desc">
				Please confirm that you have successfully transferred the money to the seller through the following payment method
				before clicking on the "Transferred, notify seller" button.
			</div>

			<div className="p2p-container-confirmation-popup-modal__content__box-input-info-confirm">
				<div className="p2p-container-confirmation-popup-modal__content__box-input-info-confirm__title">
					{paymentConfig.name}
				</div>

				{paymentConfig.fields.map((e, index) => {
					return (
						e.type !== 'image' &&
						paymentMethod.fields[index]?.value && (
							<div
								className="p2p-container-confirmation-popup-modal__content__box-input-info-confirm__input"
								key={index}
							>
								<div className="p2p-container-confirmation-popup-modal__content__box-input-info-confirm__input__title">
									{e.label}
								</div>

								<div className="p2p-container-confirmation-popup-modal__content__box-input-info-confirm__input__input-text">
									{formatLongText(paymentMethod.fields[index]?.value, 'right', 20)}
								</div>
							</div>
						)
					);
				})}
			</div>

			<div className="p2p-container-confirmation-popup-modal__content__box-info">
				<b>Tip</b>: I understand that I must use the selected payment platform to complete the transfer myself. Binance
				will not automatically transfer the payment on my behalf.
			</div>

			<div className="p2p-container-confirmation-popup-modal__content__box-allow">
				<div className="p2p-container-confirmation-popup-modal__content__box-allow__check-box">
					<div
						className="p2p-container-confirmation-popup-modal__content__box-allow__check-box__custom-checkbox"
						onClick={() => setIsAllow(!isAllow)}
					>
						{isAllow ? (
							<FaCheck className="p2p-container-confirmation-popup-modal__content__box-allow__check-box__custom-checkbox__icon" />
						) : (
							<></>
						)}
					</div>
				</div>
				<div className="p2p-container-confirmation-popup-modal__content__box-allow__desc">
					I have made payment from my real-name verified payment account consistent with my registered name on Binance.
				</div>
			</div>

			<div className="p2p-container-confirmation-popup-modal__content__box-btn mb-2">
				<div
					className="p2p-container-confirmation-popup-modal__content__box-btn__cancel pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={() => closePopUp(false)}
				>
					Cannel
				</div>
				<button className={classActiveBtnConfirm} disabled={!isAllow} onClick={onConfirm}>
					Confirm payment
				</button>
			</div>
		</Modal>
	);
};
