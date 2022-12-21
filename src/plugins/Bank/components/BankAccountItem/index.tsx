import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewCustomInput, NewModal } from 'components';
import { Button } from 'react-bootstrap';
import { selectUserInfo } from 'modules';
import { BankAccount } from 'modules/plugins/fiat/bank/types';
import { deleteBankAccount } from 'modules/plugins/fiat/bank/actions/bankAccountActions';

interface BankAccountItemProps {
	index: number;
	bankAccountItem: BankAccount;
}

export const BankAccountItem = (props: BankAccountItemProps) => {
	const { index, bankAccountItem } = props;

	// store
	const user = useSelector(selectUserInfo);

	// dispatch
	const dispatch = useDispatch();

	const [twoFACode, setTwoFACode] = useState<string>('');

	const [showDeleteConfirmationForm, setShowDeleteConfirmationForm] = useState(false);
	const [show2FAVerification, setShow2FAVerificationForm] = useState(false);

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
		setTwoFACode('');
	};

	const renderBodyModalForm = () => {
		return (
			<form className="desktop-bank-account-list-screen__bank-form">
				<h4 style={{ textAlign: 'center' }}>Do you really want to delete this bank account?</h4>
				<div className="d-flex flex-row justify-content-around mt-5">
					<div>
						<Button
							block={true}
							className="desktop-bank-account-list-screen__bank-form__button desktop-bank-account-list-screen__bank-form__button--remove"
							variant="primary"
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
								padding: '0.5em 3em',
							}}
							variant="primary"
							onClick={() => handleCloseDeleteConfirmationForm()}
						>
							Cancel
						</Button>
					</div>
				</div>
			</form>
		);
	};

	const renderBodyModal2FAVerificationForm = () => {
		const isValid2FA = twoFACode.match('^[0-9]{6}$');

		return (
			<form className="desktop-bank-account-list-screen__bank-form">
				<h5 style={{ textAlign: 'left', marginBottom: '2em' }}>Enter 2FA Code from the app</h5>
				<div className="desktop-bank-account-list-screen__bank-form__input">
					<label>2FA Code</label>
					<div>
						<NewCustomInput
							labelVisible={true}
							type="number"
							label="2FA Code"
							placeholder="Enter your 2FA code"
							defaultLabel="2FA Code"
							handleFocusInput={() => {}}
							handleChangeInput={value => {
								setTwoFACode(value);
							}}
							inputValue={twoFACode!}
							classNameLabel="d-none"
							classNameInput="td-email-form__input"
							autoFocus={true}
						/>
					</div>
				</div>
				<div className="d-flex justify-content-center mt-4">
					<Button
						disabled={!isValid2FA}
						block={true}
						style={{
							background: 'var(--blue)',
							border: '1px solid #848E9C',
							borderRadius: '50px',
							fontWeight: 600,
							fontSize: 14,
						}}
						className="w-100"
						size="lg"
						variant="primary"
						onClick={() => {
							handleClose2FAVerificationForm();
							handleShowDeleteConfirmationForm();
						}}
					>
						Send
					</Button>
				</div>
			</form>
		);
	};

	return (
		<tr className="desktop-bank-account-list-screen__bank-account-list__bank-account-item" style={{ lineHeight: 5 }}>
			<td>{index}</td>
			<td style={{ textAlign: 'left' }}>{bankAccountItem.account_name}</td>
			<td>{bankAccountItem.account_number}</td>
			<td>{bankAccountItem.bank_name}</td>
			<td>{bankAccountItem.bank_address}</td>
			<td>
				<Button
					className="desktop-bank-account-list-screen__bank-account-list__bank-account-item__remove-btn"
					onClick={() => user.otp && handleShow2FAVerificationForm()}
				>
					Remove
				</Button>
			</td>
			<NewModal
				className="desktop-bank-account-list-screen__new-modal"
				show={showDeleteConfirmationForm}
				onHide={handleCloseDeleteConfirmationForm}
				titleModal="DELETE BANk ACCOUNT CONFIRMATION"
				bodyModal={renderBodyModalForm()}
			/>
			<NewModal
				className="desktop-bank-account-list-screen__new-modal"
				show={show2FAVerification}
				onHide={handleClose2FAVerificationForm}
				titleModal="2FA Verification"
				bodyModal={renderBodyModal2FAVerificationForm()}
			/>
		</tr>
	);
};
