import { Modal } from 'antd';
import classNames from 'classnames';
import { NewCustomInput } from 'components';
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface ModalConfirmOtpP2PProps {
	show: boolean;
	closePopUp: () => void;
	onConfirm: (code2Fa: string) => void;
}

export const ModalConfirmOtpP2P = (props: ModalConfirmOtpP2PProps) => {
	const { show, closePopUp, onConfirm } = props;
	const [code2Fa, setCode2Fa] = React.useState('');

	var modal = document.getElementById('p2p-container-confirmation-otp-popup-modal');
	window.onclick = function (event) {
		if (event.target == modal) {
			if (modal !== null) {
				closePopUp();
			}
		}
	};
	const handleChange2FaCode = (value: string) => {
		setCode2Fa(value);
	};

	// const classShow = classNames('p2p-container-confirmation-otp-popup-modal');
	const classActiveBtnConfirm = classNames(
		'p2p-container-confirmation-otp-popup-modal__content__box-btn__confirm pg-p2p-config-global__btn',
		{
			'pg-p2p-config-global__btn--active': code2Fa.match('^[0-9]{6}$'),
			'pg-p2p-config-global__btn--disable': !code2Fa.match('^[0-9]{6}$'),
		},
	);

	const isValid2Fa = code2Fa.match('^[0-9]{6}$');

	const onHandlerConfirm = () => {
		onConfirm(code2Fa);
		setCode2Fa('');
		closePopUp();
	};

	return (
		<Modal closable={false} visible={show}>
			<div className="p2p-container-confirmation-otp-popup-modal__content__title">
				<div>2FA code</div>

				<AiOutlineCloseCircle onClick={() => closePopUp()} />
			</div>

			<div className="p2p-container-confirmation-otp-popup-modal__content__desc">
				<NewCustomInput
					type="text"
					label="2FA code"
					placeholder="2FA code"
					defaultLabel=""
					handleChangeInput={handleChange2FaCode}
					inputValue={code2Fa}
					classNameLabel="d-none"
					classNameInput="td-email-form__input"
					autoFocus={true}
				/>
			</div>

			<div className="p2p-container-confirmation-otp-popup-modal__content__box-btn mb-2">
				<button className={classActiveBtnConfirm} disabled={!isValid2Fa} onClick={onHandlerConfirm}>
					Confirm
				</button>
			</div>
		</Modal>
	);
};
