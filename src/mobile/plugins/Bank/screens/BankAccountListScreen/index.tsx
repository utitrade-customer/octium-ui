import { NewCustomInput } from 'components/NewCustomInput';
import { AddIcon } from 'mobile/assets/images/AddIcon';
import { Subheader } from 'mobile/components/Subheader';
import { selectUserInfo } from 'modules/user/profile/selectors';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BankAccountItem } from '../../components';
import NoticeBlueIcon from 'assets/icons/notice_blue.svg';
import { NewModal } from 'components/NewModal';
import {
	selectBankAccountList,
	selectBankAccountListLoading,
	selectCreateBankAccountLoading,
	selectDeleteBankAccountLoading,
} from 'modules/plugins/fiat/bank/selectors';
import { bankAccountListFetch, createBankAccount } from 'modules/plugins/fiat/bank/actions/bankAccountActions';
import { LoadingGif } from 'components/LoadingGif';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { selectPublicBankList } from 'modules/public/fiat/bank/selectors';
import { getKycStatus, selectKycStatus } from 'modules';
import { bankListFetch } from 'modules/public/fiat/bank/actions';
import Select from 'react-select';

interface BankFormField {
	bankName: string;
	bankAddress: string;
	bankAccountNumber: string;
	iFSCCode: string;
	otpCode: string;
}

const SelectStyles = {
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isFocused ? 'var(--blue)' : 'var(--main-background-color)',
		color: 'rgb(var(--rgb-text-black))',
		cursor: 'pointer',
	}),
	control: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: '#000',
		backgroundColor: 'rgb(var(--rgb-main-background-color))',
	}),
	placeholder: (provided, state) => ({
		...provided,
		color: 'rgb(var(--rgb-text-black))',
	}),
	singleValue: (provided, state) => ({
		...provided,
		color: 'rgb(var(--rgb-text-black))',
	}),
	menu: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: 'rgb(var(--rgb-text-black))',
		backgroundColor: 'var(--main-background-color)',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	}),
	input: (provided, state) => ({
		...provided,
		color: 'rgb(var(--rgb-text-black))',
	}),
};

export const BankAccountListMobileScreen = () => {
	const history = useHistory();
	const intl = useIntl();

	// store
	const bankAccountList = useSelector(selectBankAccountList);
	const isBankAccountListLoading = useSelector(selectBankAccountListLoading);
	const user = useSelector(selectUserInfo);
	const isCreatingBankAccount = useSelector(selectCreateBankAccountLoading);
	const isDeletingBankAccount = useSelector(selectDeleteBankAccountLoading);
	const publicBankAccountList = useSelector(selectPublicBankList);
	const kycStatus = useSelector(selectKycStatus);

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchBankAccountList = () => dispatch(bankAccountListFetch());
	const dispatchFetchPublicBankList = () => dispatch(bankListFetch());

	const redirectToVerifyKYC = () => history.push('/profile/kyc');

	const [showAddBankAccountForm, setShowAddBankAccountForm] = React.useState(false);

	const handleCloseAddBankAccountForm = () => {
		setShowAddBankAccountForm(false);
	};
	const handleShowAddBankAccountForm = () => {
		setShowAddBankAccountForm(true);
	};

	const translate = (e: string) => {
		return intl.formatMessage({ id: e });
	};

	const [bankForm, setBankForm] = React.useState<BankFormField>({
		bankName: '',
		bankAddress: '',
		bankAccountNumber: '',
		iFSCCode: '',
		otpCode: '',
	});

	const resetForm = () => {
		setBankForm({
			bankName: '',
			bankAddress: '',
			bankAccountNumber: '',
			iFSCCode: '',
			otpCode: '',
		});
	};
	const handleFieldBankForm = (field: string, value: string) => {
		setBankForm(prev => ({
			...prev,
			[field]: value,
		}));
	};
	React.useEffect(() => {
		dispatchFetchBankAccountList();
		dispatchFetchPublicBankList();
		dispatch(getKycStatus());
	}, []);

	const handleCreateBankAccount = () => {
		dispatch(
			createBankAccount({
				account_name: kycStatus.fullname!,
				account_number: bankForm.bankAccountNumber,
				bank_address: bankForm.bankAddress,
				bank_name: bankForm.bankName,
				ifsc_code: bankForm.iFSCCode,
				otp: bankForm.otpCode,
			}),
		);
		handleCloseAddBankAccountForm();
		resetForm();
	};

	const isValidForm = () => {
		const { bankName, iFSCCode, bankAddress, bankAccountNumber, otpCode } = bankForm;
		const isValid2FA = otpCode.match('^[0-9]{6}$');

		return kycStatus.fullname && bankName && iFSCCode && bankAddress && bankAccountNumber && isValid2FA;
	};

	const options = publicBankAccountList.map((bank, index) => {
		const newBank = {
			value: bank.bank_name,
			label: <span>{bank.bank_name}</span>,
		};

		return newBank;
	});

	const handleChange = (selectedOption: any) => {
		const selectedBank = String(selectedOption.value);

		handleFieldBankForm('bankName', selectedBank);
	};

	const renderBodyModalAddBankForm = () => {
		return (
			<form className="pg-mobile-profile-bank-accounts-screen__bank-form">
				<div className="pg-mobile-profile-bank-accounts-screen__bank-form__input">
					<label>Bank Name</label>
					<Select
						autoFocus
						backspaceRemovesValue={false}
						controlShouldRenderValue={true}
						hideSelectedOptions={false}
						isClearable={false}
						onChange={handleChange}
						options={options}
						placeholder="Select bank's name"
						styles={SelectStyles}
						tabSelectsValue={true}
					/>
				</div>

				<div className="pg-mobile-profile-bank-accounts-screen__bank-form__input">
					<label>Name of Account</label>
					<div style={{ marginBottom: 3 }}>
						<NewCustomInput
							type="text"
							label="Name of Account"
							placeholder="Enter your account"
							defaultLabel="Name of Account"
							isDisabled={true}
							readOnly={true}
							handleFocusInput={() => {}}
							inputValue={kycStatus.fullname!}
							classNameLabel="d-none"
							classNameInput="td-email-form__input"
							autoFocus={true}
						/>
					</div>
					<span className="pg-mobile-profile-bank-accounts-screen__bank-form__input__warning">
						<img
							src={NoticeBlueIcon}
							className="pg-mobile-profile-bank-accounts-screen__bank-form__input__warning__icon"
						/>
						Recipient name must be the same as recorded on our platform. Please contact{' '}
						{
							<span className="pg-mobile-profile-bank-accounts-screen__bank-form__input__warning__highlight">
								administrator support
							</span>
						}{' '}
						for any issues.
					</span>
				</div>

				<div className="pg-mobile-profile-bank-accounts-screen__bank-form__input">
					<label>Bank Address</label>
					<div>
						<NewCustomInput
							type="text"
							label="Bank Address"
							placeholder="Enter your bank's address"
							defaultLabel="Bank Address"
							handleFocusInput={() => {}}
							handleChangeInput={value => {
								handleFieldBankForm('bankAddress', value);
							}}
							inputValue={bankForm.bankAddress}
							classNameLabel="d-none"
							maxLength={50}
						/>
					</div>
				</div>
				<div className="pg-mobile-profile-bank-accounts-screen__bank-form__input">
					<label>Bank Account Number</label>
					<div>
						<NewCustomInput
							type="text"
							label="Bank Account Number"
							placeholder="Enter your bank account's number"
							defaultLabel="Bank Account Number"
							handleFocusInput={() => {}}
							handleChangeInput={value => {
								if (isNaN(Number(value)) && value.length > 0) {
									return;
								}
								handleFieldBankForm('bankAccountNumber', value);
							}}
							inputValue={bankForm.bankAccountNumber}
							classNameLabel="d-none"
							maxLength={20}
						/>
					</div>
				</div>
				<div className="pg-mobile-profile-bank-accounts-screen__bank-form__input">
					<label>IFSC Code</label>
					<div>
						<NewCustomInput
							type="text"
							label="IFSC Code"
							placeholder="Enter IFSC code"
							defaultLabel="IFSC Code"
							handleFocusInput={() => {}}
							handleChangeInput={value => {
								handleFieldBankForm('iFSCCode', value);
							}}
							inputValue={bankForm.iFSCCode}
							classNameLabel="d-none"
							maxLength={11}
						/>
					</div>
				</div>
				<div className="pg-mobile-profile-bank-accounts-screen__bank-form__input">
					<label>OTP Code</label>
					<div>
						<NewCustomInput
							type="text"
							label="OTP Code"
							placeholder="Max length is 6"
							defaultLabel="OTP Code"
							handleFocusInput={() => {}}
							handleChangeInput={value => {
								if ((!Number(value) && value.length > 0) || value.length >= 7) {
									return;
								}

								handleFieldBankForm('otpCode', value);
							}}
							inputValue={bankForm.otpCode}
							classNameLabel="d-none"
						/>
					</div>
				</div>

				<div className="d-flex justify-content-center mt-4">
					<Button
						disabled={!isValidForm()}
						block={true}
						className="pg-mobile-profile-bank-accounts-screen__bank-form__button w-50"
						style={{
							background: !isValidForm() ? 'rgb(var(--rgb-blue-50))' : 'rgb(var(--rgb-blue))',
						}}
						size="lg"
						variant="primary"
						onClick={() => handleCreateBankAccount()}
					>
						Confirm
					</Button>
				</div>
			</form>
		);
	};

	const overLayClassName = 'pg-mobile-profile-bank-accounts-screen__overlay';

	return (
		<React.Fragment>
			<Subheader
				title="Bank Accounts"
				// backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
				onGoBack={() => history.push('/profile')}
			/>
			<div className="pg-mobile-profile-bank-accounts-screen">
				<div
					className={classNames(
						overLayClassName,
						{
							[`${overLayClassName}--display`]: isCreatingBankAccount || isDeletingBankAccount,
						},
						{
							[`${overLayClassName}--not-display`]: !isCreatingBankAccount && !isDeletingBankAccount,
						},
					)}
				>
					<div className={`${overLayClassName}__loading`}>
						<LoadingGif />
						<h3 className="mr-4" style={{ color: 'rgb(var(--rgb-text-black))' }}>
							Loading
						</h3>
					</div>
				</div>

				{user.otp ? (
					<div
						className="pg-mobile-profile-bank-accounts-screen__create" /* onClick={() => handleSetApiKeyProcess('create')} */
						onClick={() => handleShowAddBankAccountForm()}
					>
						<AddIcon />
					</div>
				) : null}
				<div className="pg-mobile-profile-bank-accounts-screen__list">
					{kycStatus.status !== 'verify' ? (
						<div className="d-flex flex-column justify-content-center align-items-center">
							<h6 style={{ marginBottom: '2em' }}>You need to enable Verify your account to use bank feature</h6>
							<button
								onClick={() => redirectToVerifyKYC()}
								className="pg-mobile-profile-bank-accounts-screen__list__verify-btn"
							>
								{translate('page.mobile.wallets.currency.withdraw.body.btn.enable2Fa')}
							</button>
						</div>
					) : !user.otp ? (
						<span className="no-data">{intl.formatMessage({ id: 'page.noDataToShow' })}</span>
					) : isBankAccountListLoading ? (
						<div className="mt-3">
							<LoadingGif alt="loading" />
							<h3 className="mr-4">Loading</h3>
						</div>
					) : bankAccountList.length !== 0 ? (
						bankAccountList.map(bankAccount => <BankAccountItem bankAccountItem={bankAccount} key={bankAccount.id} />)
					) : (
						<span className="no-data">{intl.formatMessage({ id: 'page.noDataToShow' })}</span>
					)}
				</div>
				<NewModal
					className="pg-mobile-profile-bank-accounts-screen__new-modal"
					show={showAddBankAccountForm}
					onHide={handleCloseAddBankAccountForm}
					titleModal="BANK INFORMATION"
					bodyModal={renderBodyModalAddBankForm()}
				/>
			</div>
		</React.Fragment>
	);
};
