import React from 'react';
import { BankAccount } from 'modules/plugins/fiat/bank/types';
import { TwoFactorModal } from 'mobile/components/TwoFactorModal';
import { deleteBankAccount } from 'modules/plugins/fiat/bank/actions/bankAccountActions';
import { useDispatch } from 'react-redux';
// import { selectUserInfo } from 'modules';
import { NewModal } from 'components';
import { Button } from 'antd';

interface BankAccountItemProps {
	bankAccountItem: BankAccount;
}

export const BankAccountItem = (props: BankAccountItemProps) => {
	const { bankAccountItem } = props;

	// store
	// const user = useSelector(selectUserInfo);

	// dispatch
	const dispatch = useDispatch();

	const [twoFACode, setTwoFACode] = React.useState<string>('');

	const [showDeleteConfirmationForm, setShowDeleteConfirmationForm] = React.useState(false);
	const [show2FAVerification, setShow2FAVerificationForm] = React.useState(false);

	const handleCloseDeleteConfirmationForm = () => {
		setShowDeleteConfirmationForm(false);
	};
	const handleShowDeleteConfirmationForm = () => {
		setShowDeleteConfirmationForm(true);
	};

	const handleClose2FAVerificationForm = () => {
		setShow2FAVerificationForm(false);
	};
	const handleShow2FAVerificationForm = () => {
		setShow2FAVerificationForm(true);
	};

	const handleDeleteBankAccount = () => {
		handleCloseDeleteConfirmationForm();
		dispatch(
			deleteBankAccount({
				account_number: bankAccountItem.account_number,
				otp: twoFACode,
			}),
		);
	};
	const handleTriggerAction = (code2FA: string) => {
		setTwoFACode(code2FA);

		const isValid2FA = code2FA.match('^[0-9]{6}$');

		handleClose2FAVerificationForm();
		isValid2FA && handleShowDeleteConfirmationForm();
	};
	const renderBodyModalForm = () => {
		return (
			<form className="pg-mobile-profile-bank-accounts-screen__bank-form">
				<h5 style={{ textAlign: 'center' }}>Do you really want to delete this bank account?</h5>
				<div className="d-flex flex-row justify-content-around mt-5">
					<div>
						<Button
							block={true}
							className="pg-mobile-profile-bank-accounts-screen__bank-form__button pg-mobile-profile-bank-accounts-screen__bank-form__button--remove"
							onClick={() => handleDeleteBankAccount()}
						>
							Remove
						</Button>
					</div>
					<div>
						<Button
							block={true}
							style={{
								background: '#D6DADF',
								border: '1px solid #848E9C',
								borderRadius: '50px',
								color: '#000',
								fontWeight: 600,
								fontSize: '1rem',
								padding: '0.3em 3em',
							}}
							onClick={() => handleCloseDeleteConfirmationForm()}
						>
							Cancel
						</Button>
					</div>
				</div>
			</form>
		);
	};

	return (
		<div className="pg-mobile-profile-bank-accounts-item">
			<div className="pg-mobile-profile-bank-accounts-item__header d-flex flex-row justify-content-between align-items-center">
				<span>{bankAccountItem.bank_name}</span>
				<Button
					className="pg-mobile-profile-bank-accounts-item__header__button"
					onClick={() => handleShow2FAVerificationForm()}
				>
					<svg width="15" height="15" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M5.59863 4.35889L7.55176 2.40576C7.80566 2.17139 7.80566 1.78076 7.55176 1.54639L7.12207 1.1167C6.8877 0.862793 6.49707 0.862793 6.2627 1.1167L4.30957 3.06982L2.33691 1.1167C2.10254 0.862793 1.71191 0.862793 1.47754 1.1167L1.04785 1.54639C0.793945 1.78076 0.793945 2.17139 1.04785 2.40576L3.00098 4.35889L1.04785 6.33154C0.793945 6.56592 0.793945 6.95654 1.04785 7.19092L1.47754 7.62061C1.71191 7.87451 2.10254 7.87451 2.33691 7.62061L4.30957 5.66748L6.2627 7.62061C6.49707 7.87451 6.8877 7.87451 7.12207 7.62061L7.55176 7.19092C7.80566 6.95654 7.80566 6.56592 7.55176 6.33154L5.59863 4.35889Z"
							fill="#C22603"
						/>
					</svg>
					<span>Remove </span>
				</Button>
			</div>
			<div className="pg-mobile-profile-bank-accounts-item__body-content">
				<span className="pg-mobile-profile-bank-accounts-item__body-content__label">Account Number</span>
				<span className="pg-mobile-profile-bank-accounts-item__body-content__content">
					{bankAccountItem.account_number}
				</span>
			</div>
			<div className="pg-mobile-profile-bank-accounts-item__body-content">
				<span className="pg-mobile-profile-bank-accounts-item__body-content__label">Account Name</span>
				<span className="pg-mobile-profile-bank-accounts-item__body-content__content">
					{bankAccountItem.account_name}
				</span>
			</div>
			<div className="pg-mobile-profile-bank-accounts-item__body-content">
				<span className="pg-mobile-profile-bank-accounts-item__body-content__label">Bank Address</span>
				<span className="pg-mobile-profile-bank-accounts-item__body-content__content">
					{bankAccountItem.bank_address}
				</span>
			</div>
			<NewModal
				className="pg-mobile-profile-bank-accounts-screen__new-modal"
				show={showDeleteConfirmationForm}
				onHide={handleCloseDeleteConfirmationForm}
				titleModal="DELETE BANk ACCOUNT CONFIRMATION"
				bodyModal={renderBodyModalForm()}
			/>
			<TwoFactorModal showModal={show2FAVerification} handleToggle2FA={handleTriggerAction} />
		</div>
	);
};
