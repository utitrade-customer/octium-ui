import React from 'react';
import _toNumber from 'lodash/toNumber';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';
import _toString from 'lodash/toString';
import { Button, Input, Select } from 'antd';
import { NewModal } from 'components';
import { useHistory } from 'react-router';
import { formatNumber } from 'helpers';
import NoticeBlueIcon from 'assets/icons/notice_blue.svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrencies, selectUserInfo, selectWallets } from 'modules';
import { selectBankAccountList, selectCreateBankWithdrawLoading } from 'modules/plugins/fiat/bank/selectors';
import { bankAccountListFetch } from 'modules/plugins/fiat/bank/actions/bankAccountActions';
import { createBankWithdraw } from 'modules/plugins/fiat/bank/actions/bankWithdrawActions';
import NP from 'number-precision';
import { useIntl } from 'react-intl';
import { LoadingGif } from 'components/LoadingGif';

interface BankDepositScreenProps {
	currency_id: string;
}

export const BankWithdrawScreen = (props: BankDepositScreenProps) => {
	const { Option } = Select;
	const { currency_id } = props;
	const intl = useIntl();

	const history = useHistory();

	// selectors
	const currencies = useSelector(selectCurrencies);
	const wallets = useSelector(selectWallets);
	const bankAccountList = useSelector(selectBankAccountList);
	const user = useSelector(selectUserInfo);
	const isWithdrawing = useSelector(selectCreateBankWithdrawLoading);

	// dispatch
	const dispatch = useDispatch();

	const currency = _find(currencies, { id: _toLower(currency_id) });
	const wallet = _find(wallets, { currency: _toLower(currency_id) });

	const [showWithdrawConfirmationForm, setShowWithdrawConfirmationForm] = React.useState(false);
	const [bankAccountSelectionValue, setBankAccountSelectionValue] = React.useState('');
	const [isSmallerThanMinWithdraw, setIsSmallerThanMinWithdraw] = React.useState(false);
	const [isAmountLargerThanBalance, setIsAmountLargerThanBalance] = React.useState(false);
	const [otpInputValueState, setOtpInputValueState] = React.useState('');
	const [withdrawInputValueState, setWithdrawInputValueState] = React.useState<string>('');

	const bankAccount = _find(bankAccountList, { id: Number(bankAccountSelectionValue) });

	const translate = (e: string) => {
		return intl.formatMessage({ id: e });
	};

	const handleCloseWithdrawConfirmationForm = () => {
		setShowWithdrawConfirmationForm(false);
	};

	const handleShowWithdrawConfirmationForm = () => {
		setShowWithdrawConfirmationForm(true);
	};

	const onHandleSelectBankAccount = (value: string) => {
		setBankAccountSelectionValue(value);
	};

	const onHandleChangeNumeric = e => {
		let value = e.target.value;

		if (!Number(value) && value.length > 0) {
			return;
		}

		setOtpInputValueState(value);
	};

	const onHandleChangeWithdrawInputValueState: React.ChangeEventHandler<HTMLInputElement> = e => {
		let value = e.target.value;

		const indexOfDot: number = removeCommaInNumber(value).indexOf('.');

		if ((isNaN(Number(removeCommaInNumber(value))) && value.length > 0) || indexOfDot === 0) {
			return;
		}

		const amount: number = Number(removeCommaInNumber(value));

		if (amount >= 0 && amount <= Number(wallet?.balance)) {
			setIsAmountLargerThanBalance(false);
		} else {
			setIsAmountLargerThanBalance(true);
		}

		if (amount < Number(currency?.min_withdraw_amount)) {
			setIsSmallerThanMinWithdraw(true);
		} else {
			setIsSmallerThanMinWithdraw(false);
		}

		setWithdrawInputValueState(value);
	};

	const removeCommaInNumber = (numberWithComma: string): string => {
		return numberWithComma.split(',').join('');
	};

	const handleCreateBankWithdraw = () => {
		dispatch(
			createBankWithdraw({
				amount: Number(removeCommaInNumber(withdrawInputValueState)),
				currency_id,
				bank_id: Number(bankAccountSelectionValue),
				otp: otpInputValueState,
			}),
		);
		handleCloseWithdrawConfirmationForm();
		setWithdrawInputValueState('');
		setOtpInputValueState('');
		setBankAccountSelectionValue('-1');
	};
	React.useEffect(() => {
		dispatch(bankAccountListFetch());
	}, []);

	const isEmpty = (value: string): boolean => {
		return value.trim().length === 0;
	};
	const isFormValid = () => {
		const isValid2FA = otpInputValueState.match('^[0-9]{6}$');

		return (
			bankAccountSelectionValue !== '-1' &&
			isValid2FA &&
			!isEmpty(withdrawInputValueState) &&
			!isEmpty(bankAccountSelectionValue) &&
			!isSmallerThanMinWithdraw &&
			!isAmountLargerThanBalance
		);
	};

	const renderBodyModalWithdrawConfirmationForm = () => {
		return (
			<div className="td-mobile-wallet-fiat-bank-withdraw__modal-form d-flex flex-column align-items-center">
				<span style={{ fontWeight: 600, fontSize: 14, color: 'rgb(var(--rgb-text-black))' }}>You will get</span>
				<div className="row align-items-center justify-content-center">
					<span className="mr-1" style={{ fontWeight: 700, fontSize: 36, color: 'rgb(var(--rgb-text-black))' }}>
						{youWillGet}
					</span>
					<span style={{ fontWeight: 400, fontSize: 16, color: 'rgb(var(--rgb-text-black))' }}>
						{_toUpper(currency_id)}
					</span>
				</div>
				<div className="td-mobile-wallet-fiat-bank-withdraw__modal-form__inform-container">
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Account Number</span>
						<span style={{ textAlign: 'right' }}>{bankAccount?.account_number}</span>
					</div>
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Bank Name</span>
						<span style={{ textAlign: 'right' }}>{bankAccount?.bank_name}.</span>
					</div>
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Fee</span>
						<span style={{ textAlign: 'right' }}>{Number(formatNumber(currency?.withdraw_fee!))} %</span>
					</div>
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Withdrawal Amount</span>
						<span style={{ textAlign: 'right' }}>
							{youWillGet} {_toUpper(currency_id)}
						</span>{' '}
					</div>
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Funds will arrive</span>
						<span>Within 48 hours</span>
					</div>
				</div>
				<span className="td-mobile-wallet-fiat-bank-withdraw__modal-form__warning">
					<img src={NoticeBlueIcon} className="td-mobile-wallet-fiat-bank-withdraw__modal-form__warning__icon" />
					Withdrawal usually take under 24 hours. Depends on the speed of your bank. a delay may occur.
				</span>
				<div className="d-flex justify-content-center mt-5">
					<Button
						className="td-mobile-wallet-fiat-bank-withdraw__button"
						style={{ background: 'rgb(var(--rgb-blue))' }}
						onClick={handleCreateBankWithdraw}
					>
						Confirmation
					</Button>
				</div>
			</div>
		);
	};

	const youWillGet: string = formatNumber(
		NP.minus(
			Number(removeCommaInNumber(withdrawInputValueState!)),
			NP.divide(NP.times(Number(removeCommaInNumber(withdrawInputValueState!)), Number(currency?.withdraw_fee)), 100),
		).toString(),
	);

	const redirectToEnable2fa = () => history.push('/profile/2fa', { enable2fa: true });

	return (
		<div className="td-mobile-wallet-fiat-bank-withdraw">
			{!user.otp ? (
				<div className="d-flex flex-column justify-content-center align-items-center">
					<h5 style={{ marginBottom: '2em' }}>You need to enable 2FA to withdraw</h5>
					<button onClick={() => redirectToEnable2fa()} className="td-mobile-wallet-fiat-bank-withdraw__button">
						{translate('page.mobile.wallets.currency.withdraw.body.btn.enable2Fa')}
					</button>
				</div>
			) : isWithdrawing ? (
				<div
					className="d-flex justify-content-center align-items-center"
					style={{
						minHeight: '30rem',
					}}
				>
					<LoadingGif />
				</div>
			) : (
				<React.Fragment>
					<div className="td-mobile-wallet-fiat-bank-withdraw__select">
						<div
							className="d-flex flex-row justify-content-between"
							style={{
								paddingBottom: '0.12rem',
							}}
						>
							<label className="td-mobile-wallet-fiat-bank-withdraw__select__label">Select Bank</label>
							<label
								className="td-mobile-wallet-fiat-bank-withdraw__select__settings-label"
								onClick={() => history.push('/profile/bank')}
							>
								Bank accounts settings
							</label>
						</div>
						<Select
							size="large"
							defaultValue="-1"
							className="td-mobile-wallet-fiat-bank-withdraw__select__input"
							onChange={onHandleSelectBankAccount}
						>
							<Option value="-1">Select your Bank</Option>
							{bankAccountList.map(bankAccount => (
								<Option
									value={`${bankAccount.id}`}
									key={bankAccount.id}
								>{`${bankAccount.bank_name} - Account: ${bankAccount.account_number}`}</Option>
							))}
						</Select>
					</div>
					<div className="td-mobile-wallet-fiat-bank-withdraw__input mt-4">
						<div className="d-flex flex-row justify-content-between">
							<label>Amount</label>
							<div>
								<span className="td-mobile-wallet-fiat-bank-withdraw__select__balance-label">Balance: </span>
								<span className="td-mobile-wallet-fiat-bank-withdraw__select__balance-value">
									{wallet?.balance ? formatNumber(Number(wallet?.balance).toFixed(wallet.fixed)) : 0}{' '}
									{_toUpper(currency_id)}
								</span>
							</div>
						</div>
						<Input
							size="large"
							placeholder={`Min amount: ${formatNumber(currency?.min_withdraw_amount!)} ${_toUpper(currency_id)}`}
							type="text"
							value={formatNumber(removeCommaInNumber(withdrawInputValueState!))}
							onChange={onHandleChangeWithdrawInputValueState}
							disabled={!(currency && currency.withdrawal_enabled)}
							style={{ marginBottom: '0.5em' }}
						/>
						{isSmallerThanMinWithdraw ? (
							<div className="td-mobile-wallet-fiat-bank-withdraw__input__error">
								Withdraw amount must be at least {formatNumber(currency?.min_withdraw_amount!)}{' '}
								{_toUpper(currency_id)}
							</div>
						) : null}
						{isAmountLargerThanBalance ? (
							<span className="td-mobile-wallet-fiat-bank-withdraw__input__error">
								Your balance is not enough to withdraw
							</span>
						) : null}
					</div>
					<div className="td-mobile-wallet-fiat-bank-withdraw__input">
						<label>OTP</label>
						<Input
							size="large"
							placeholder="Max length is 6"
							type="text"
							maxLength={6}
							onChange={onHandleChangeNumeric}
							value={otpInputValueState}
						/>
					</div>

					<div className="d-flex flex-row justify-content-between">
						<span className="td-mobile-wallet-fiat-bank-withdraw__label">You will get: </span>
						<span className="td-mobile-wallet-fiat-bank-withdraw__value">
							{youWillGet} {_toUpper(currency_id)}
						</span>
					</div>

					<div className="d-flex flex-row justify-content-between">
						<span className="td-mobile-wallet-fiat-bank-withdraw__label">Fee: </span>
						<span className="td-mobile-wallet-fiat-bank-withdraw__value">
							{Number(formatNumber(currency?.withdraw_fee!))} %
						</span>
					</div>
					{/* <div className="d-flex flex-row justify-content-between">
					<span className="td-mobile-wallet-fiat-bank-withdraw__label">Max withdraw</span>
					<span className="td-mobile-wallet-fiat-bank-withdraw__value">3,000,000 {_toUpper(currency_id)}</span>
				</div> */}
					<div className="d-flex flex-row justify-content-between">
						<span className="td-mobile-wallet-fiat-bank-withdraw__label">Min withdraw</span>
						<span className="td-mobile-wallet-fiat-bank-withdraw__value">
							{Number(formatNumber(currency?.min_withdraw_amount!))} {_toUpper(currency_id)}
						</span>
					</div>

					<div className="d-flex justify-content-center mt-5">
						<Button
							className="td-mobile-wallet-fiat-bank-withdraw__button"
							disabled={!isFormValid()!}
							style={{
								background: isFormValid()! ? 'rgb(var(--rgb-blue))' : 'rgb(var(--rgb-blue-50))',
							}}
							onClick={handleShowWithdrawConfirmationForm}
						>
							Withdraw
						</Button>
					</div>
					<NewModal
						className="td-mobile-wallet-fiat-bank-withdraw__new-modal"
						show={showWithdrawConfirmationForm}
						onHide={handleCloseWithdrawConfirmationForm}
						titleModal="WITHRAW CONFIRMATION"
						bodyModal={renderBodyModalWithdrawConfirmationForm()}
					/>
				</React.Fragment>
			)}
		</div>
	);
};
