import { Button, Checkbox, Input } from 'antd';
import NoticeIcon from 'assets/icons/notice.svg';
import { NewModal } from 'components';
import { formatNumber } from 'helpers';
import _find from 'lodash/find';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import { alertPush, selectCurrencies } from 'modules';
import NP from 'number-precision';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QRcodeImage from '../../../assets/images/QR_code.jpg';
import NoticeBlueIcon from 'assets/icons/notice_blue.svg';
import { createBankDeposit } from 'modules/plugins/fiat/bank/actions/bankDepositActions';
import { selectCreateBankDepositLoading } from 'modules/plugins/fiat/bank/selectors';
import { LoadingGif } from 'components/LoadingGif';

interface BankDepositProps {
	currency_id: string;
}

export const BankDeposit = (props: BankDepositProps) => {
	const { currency_id } = props;

	// selectors
	const currencies = useSelector(selectCurrencies);
	const isDepositing = useSelector(selectCreateBankDepositLoading);

	// dispatch
	const dispatch = useDispatch();

	const [showDepositConfirmationForm, setShowDepositConfirmationForm] = React.useState(false);
	const [isSmallerThanMinDeposit, setIsSmallerThanMinDeposit] = React.useState(false);

	const handleCloseDepositConfirmationForm = () => {
		setShowDepositConfirmationForm(false);
	};

	const handleShowDepositConfirmationForm = () => {
		setShowDepositConfirmationForm(true);
	};

	const currency = _find(currencies, { id: _toLower(currency_id) });

	const [isContinueButtonDisabled, setIsContinueButtonDisabled] = React.useState(true);

	const onClickCheckBox = () => {
		setIsContinueButtonDisabled(state => !state);
	};

	const [transactionIDState, setTransactionIDState] = React.useState<string>('');

	const [amountInputValueState, setAmountInputValueState] = React.useState<string>('');

	const onHandleChangeAmountInputValueState: React.ChangeEventHandler<HTMLInputElement> = e => {
		let value = e.target.value;

		const indexOfDot: number = removeCommaInNumber(value).indexOf('.');

		if ((isNaN(Number(removeCommaInNumber(value))) && value.length > 0) || indexOfDot === 0) {
			return;
		}

		const depositAmount = Number(removeCommaInNumber(value));
		// console.log(depositAmount, Number(currency?.min_deposit_amount), isSmallerThanMinDeposit);

		if (depositAmount < Number(currency?.min_deposit_amount)) {
			setIsSmallerThanMinDeposit(true);
		} else {
			setIsSmallerThanMinDeposit(false);
		}

		setAmountInputValueState(value);
	};

	const removeCommaInNumber = (numberWithComma: string): string => {
		return numberWithComma.split(',').join('');
	};

	const isEmpty = (value: string): boolean => {
		return value.trim().length === 0;
	};
	const isFormNotValid = (): boolean => {
		return (
			isContinueButtonDisabled || isEmpty(transactionIDState) || isEmpty(amountInputValueState) || isSmallerThanMinDeposit
		);
	};

	async function copyTextToClipboard(label: string, text: string) {
		dispatch(alertPush({ message: [`${label} Copied!`], type: 'success' }));
		return await navigator.clipboard.writeText(text);
	}

	const renderBankAccountInform = (label: string, content: string) => {
		return (
			<div className="d-flex flex-row justify-content-between desktop-bank-deposit__inform">
				<div>{label}</div>
				<div className="row">
					{content}
					<svg
						width="17"
						height="18"
						viewBox="0 0 17 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						onClick={() => copyTextToClipboard(label, content)}
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M4.17754 2.04492V3.17725H2.49282H2.49144V3.18018C1.95935 3.18164 1.47701 3.41016 1.12873 3.78076C0.783222 4.14844 0.567622 4.65674 0.56624 5.21924H0.563477V5.22217V15.9551V15.9565H0.56624C0.567622 16.519 0.783222 17.0303 1.13288 17.4009C1.47978 17.7671 1.95935 17.9956 2.49005 17.9971V18H2.49282H11.0201H11.0215V17.9971C11.5522 17.9956 12.0359 17.7671 12.3842 17.3965C12.7297 17.0288 12.9453 16.5205 12.9467 15.958H12.9494V15.9551V13.5513H14.6341H14.6355V13.5483C15.1662 13.5469 15.6499 13.3184 15.9982 12.9478C16.3437 12.5801 16.5593 12.0718 16.5607 11.5093H16.5635V11.5063V2.04492V2.04346H16.5607C16.5593 1.47949 16.3423 0.968262 15.9941 0.599121C15.6472 0.23291 15.1676 0.00439453 14.6369 0.00292969V0H14.6341H6.10688H6.1055V0.00292969C5.57341 0.00439453 5.09107 0.23291 4.7428 0.603516C4.39728 0.971191 4.18168 1.47949 4.1803 2.04199H4.17754V2.04492ZM5.63975 3.17725V2.04492V2.04199H5.63698C5.63698 1.90869 5.69088 1.78564 5.77657 1.69482C5.86088 1.60547 5.97835 1.54834 6.10412 1.54834V1.55127H6.1055H14.6328H14.6355V1.54834C14.7613 1.54834 14.8774 1.60547 14.9631 1.69629C15.0474 1.78564 15.1013 1.91016 15.1013 2.04346H15.0985V2.04492V11.5063V11.5093H15.1013C15.1013 11.6426 15.0474 11.7656 14.9617 11.8564C14.8774 11.9458 14.7599 12.0029 14.6341 12.0029V12H14.6328H12.948V5.22217V5.2207H12.9453C12.9439 4.65674 12.7269 4.14551 12.3786 3.77637C12.0317 3.41016 11.5522 3.18164 11.0215 3.18018V3.17725H11.0187H5.63975ZM2.02707 15.9551V5.22217V5.21924H2.0243C2.0243 5.08594 2.0782 4.96289 2.16389 4.87207C2.2482 4.78271 2.36567 4.72559 2.49144 4.72559V4.72852H2.49282H11.0201H11.0228V4.72559C11.1486 4.72559 11.2647 4.78271 11.3504 4.87354C11.4347 4.96289 11.4886 5.0874 11.4886 5.2207H11.4858V5.22217V15.9551V15.958H11.4886C11.4886 16.0913 11.4347 16.2144 11.349 16.3052C11.2647 16.3945 11.1472 16.4517 11.0215 16.4517V16.4487H11.0201H2.49282H2.49005V16.4517C2.36429 16.4517 2.2482 16.3945 2.16251 16.3037C2.0782 16.2144 2.0243 16.0898 2.0243 15.9565H2.02707V15.9551Z"
							fill="#4579A9"
						/>
					</svg>
				</div>
			</div>
		);
	};

	const youWillGet: string = formatNumber(
		NP.minus(
			Number(removeCommaInNumber(amountInputValueState!)),
			NP.divide(NP.times(Number(removeCommaInNumber(amountInputValueState!)), Number(currency?.deposit_fee)), 100),
		).toString(),
	);

	const BodyModalDepositConfirmationForm = () => {
		const handleCreateBankDeposit = () => {
			dispatch(
				createBankDeposit({
					currency_id,
					amount: Number(removeCommaInNumber(amountInputValueState)),
					txid: transactionIDState,
				}),
			);
			handleCloseDepositConfirmationForm();
			setIsContinueButtonDisabled(true);
			setAmountInputValueState('');
			setTransactionIDState('');
		};
		return (
			<div className="desktop-bank-deposit__modal-form d-flex flex-column align-items-center">
				<span style={{ fontWeight: 600, fontSize: 14, color: 'rgb(var(--rgb-text-black))' }}>You will get</span>
				<div className="row align-items-center">
					<span className="mr-1" style={{ fontWeight: 700, fontSize: 36, color: 'rgb(var(--rgb-text-black))' }}>
						{youWillGet}
					</span>
					<span style={{ fontWeight: 400, fontSize: 16, color: 'rgb(var(--rgb-text-black))' }}>
						{_toUpper(currency_id)}
					</span>
				</div>
				<div className="desktop-bank-deposit__modal-form__inform-container">
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Fee</span>
						<span>{Number(currency?.deposit_fee)} %</span>
					</div>
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Deposit Amount</span>
						<span>
							{youWillGet} {_toUpper(currency_id)}
						</span>
					</div>
					<div className="d-flex flex-row align-items-center justify-content-between">
						<span>Funds will arrive</span>
						<span>Within 48 hours</span>
					</div>
				</div>
				<span className="desktop-bank-deposit__modal-form__warning">
					<img src={NoticeBlueIcon} alt="notice-icon" className="desktop-bank-deposit__modal-form__warning__icon" />
					Deposit usually take under 24 hours. Depends on the speed of your bank. a delay may occur.
				</span>
				<div className="d-flex justify-content-center mt-5">
					<Button
						className="desktop-bank-deposit__button"
						style={{ background: 'rgb(var(--rgb-blue))' }}
						onClick={handleCreateBankDeposit}
					>
						Confirmation
					</Button>
				</div>
			</div>
		);
	};
	return (
		<div className="desktop-bank-deposit h-100">
			{isDepositing && (
				<div
					className="d-flex flex-column justify-content-center align-items-center"
					style={{
						minHeight: '58rem',
					}}
				>
					{' '}
					<LoadingGif />
					<h3 className="mr-4" style={{ color: 'rgb(var(--rgb-text-black))' }}>
						Loading
					</h3>
				</div>
			)}
			{!isDepositing && (
				<React.Fragment>
					<div className="desktop-bank-deposit__title">Bank Details</div>
					{renderBankAccountInform('Name', 'Coming Soon')}
					{renderBankAccountInform('Account Number', 'Coming Soon')}
					{renderBankAccountInform('Bank Name', 'Coming Soon')}
					{renderBankAccountInform('Bank Address', 'Coming Soon')}
					{renderBankAccountInform('IFSC Code', 'Coming Soon')}
					<hr
						className="solid"
						style={{ background: 'rgb(var(--rgb-alto))', width: '100%', marginTop: 25, marginBottom: 25 }}
					/>
					<div className="desktop-bank-deposit__title">Enter Deposit Amount</div>
					<div className="d-flex flex-row justify-content-between">
						<div className="col-7 pl-0">
							<div className="p-0 desktop-bank-deposit__input">
								<label className="desktop-bank-deposit__input__label">Amount</label>
								<Input
									addonAfter={_toUpper(currency_id)}
									type="text"
									placeholder={`Min amount: ${Number(currency?.min_deposit_amount)}`}
									value={formatNumber(removeCommaInNumber(amountInputValueState!))}
									onChange={onHandleChangeAmountInputValueState}
									style={{ width: '100%' }}
								/>
								{isSmallerThanMinDeposit && (
									<span className="desktop-bank-deposit__input__error">
										Deposit amount must be at least {formatNumber(currency?.min_deposit_amount!)}{' '}
										{_toUpper(currency_id)}
									</span>
								)}
							</div>

							<div className="p-0 desktop-bank-deposit__input mt-3">
								<label className="desktop-bank-deposit__input__label">
									Transaction ID{' '}
									<img className="desktop-bank-deposit__input__label__notice-icon" src={NoticeIcon} />
									<span className="tooltiptext">
										Transaction ID must be accurate and exact like the ID of the exchange
									</span>
								</label>
								<Input
									value={transactionIDState}
									maxLength={40}
									placeholder="Example: Wxsdsdk231315"
									onChange={value => setTransactionIDState(value.target.value)}
								/>
							</div>
						</div>
						<div className="col-5 d-flex justify-content-end p-0">
							<img
								src={QRcodeImage}
								className="mr-0"
								alt="QR-code"
								style={{
									maxHeight: '12rem',
									maxWidth: '15rem',
									objectFit: 'contain',
								}}
							/>
						</div>
					</div>
					<div className="desktop-bank-deposit__transaction-fee">
						<div className="d-flex flex-column justify-content-center">
							<div className="d-flex flex-row justify-content-between">
								<span className="desktop-bank-deposit__transaction-fee__label">You Will Get</span>
								<span className="desktop-bank-deposit__transaction-fee__value">
									{youWillGet} {_toUpper(currency_id)}
								</span>
							</div>

							<div className="d-flex flex-row justify-content-between mb-4 mt-4">
								<div className="desktop-bank-deposit__transaction-fee__label">Transaction Fee:</div>
								<div className="desktop-bank-deposit__transaction-fee__value">
									{Number(currency?.deposit_fee)}
									{' %'}
								</div>
							</div>

							<div className="d-flex flex-row justify-content-between">
								<div className="desktop-bank-deposit__transaction-fee__label">Min Deposit:</div>
								<span className="desktop-bank-deposit__transaction-fee__value">
									{formatNumber(Number(currency?.min_deposit_amount!).toString())} {_toUpper(currency_id)}
								</span>
							</div>
						</div>
					</div>
					<div className="desktop-bank-deposit__check-box">
						<Checkbox onChange={onClickCheckBox}>
							By proceeding, you consent to Octium sharing your personal information on your Octium account in
							accordance to our Terms of Use and Privacy Policy
						</Checkbox>
					</div>
					<div className="d-flex justify-content-end mt-4">
						<Button
							className="desktop-bank-deposit__button"
							disabled={isFormNotValid()}
							style={{
								background: isFormNotValid() ? 'rgb(var(--rgb-blue-50))' : 'rgb(var(--rgb-blue))',
							}}
							onClick={handleShowDepositConfirmationForm}
						>
							Continue
						</Button>
					</div>
				</React.Fragment>
			)}
			<NewModal
				show={showDepositConfirmationForm}
				onHide={handleCloseDepositConfirmationForm}
				titleModal="DEPOSIT CONFIRMATION"
				bodyModal={<BodyModalDepositConfirmationForm />}
			/>
		</div>
	);
};
