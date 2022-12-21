import { NewModal } from 'components';
import {
	selectCurrencies,
	selectWallets,
	selectWithdrawLimitRemains,
	withdrawLimitChecking,
	withdrawLimitFetchRemains,
} from 'modules';
import { createPaypalWithdraw } from 'modules/plugins/fiat/paypal/actions/withdraw';
import { minus } from 'number-precision';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import PaypalLogo from './paypal_logo.jpg';
import _toNumber from 'lodash/toNumber';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';
import _toString from 'lodash/toString';

interface PaypalWithdrawProps {
	currency_id: string;
}
export const PaypalWithdraw = (props: PaypalWithdrawProps) => {
	const { currency_id } = props;

	// selectors
	const currencies = useSelector(selectCurrencies);
	const wallets = useSelector(selectWallets);
	const {
		payload: { remains },
	} = useSelector(selectWithdrawLimitRemains);

	const currency = _find(currencies, { id: _toLower(currency_id) });
	const wallet = _find(wallets, { currency: _toLower(currency_id) });

	// intl
	const intl = useIntl();

	// state
	const [isShowWithdrawConfirmState, setShowWithdrawConfirmState] = useState(false);
	const [emailState, setEmailState] = useState('');
	const [amountState, setAmountState] = useState('');
	const [otpState, setOtpState] = useState('');

	// dispatch
	const dispatch = useDispatch();

	const total =
		currency && currency.withdraw_fee && amountState && _toNumber(amountState) > _toNumber(currency.withdraw_fee)
			? minus(_toNumber(amountState), _toNumber(currency.withdraw_fee))
			: 0;

	const handleCreateWithdraw = () => {
		dispatch(withdrawLimitFetchRemains());
		dispatch(withdrawLimitChecking({ currency_id: _toLower(currency_id), total_withdraw: _toNumber(amountState) }));
		dispatch(
			createPaypalWithdraw({
				currency_id: _toLower(currency_id),
				email: _toLower(emailState),
				amount: _toNumber(amountState),
				otp: _toNumber(otpState),
			}),
		);
		setShowWithdrawConfirmState(false);
		setAmountState('');
		setEmailState('');
		setOtpState('');
	};

	React.useEffect(() => {
		dispatch(withdrawLimitFetchRemains());
		dispatch(withdrawLimitChecking({ currency_id: _toLower(currency_id), total_withdraw: _toNumber(amountState) }));
	}, []);

	const getIsValidEmail = (email: string) => {
		return Boolean(
			String(email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				),
		);
	};
	const isValidEmail = getIsValidEmail(emailState);
	const isLimitWithdraw24h = _toNumber(remains) === 0 || _toNumber(amountState) > _toNumber(remains);

	const renderModalBody = () => {
		return (
			<div className="w-100">
				<div className="py-2">
					<table className="w-100 text-dark h5">
						<tbody>
							<tr>
								<td>{intl.formatMessage({ id: 'page.body.history.deposit.header.email' })}:</td>
								<td className={`text-right ${isValidEmail ? 'text-success' : 'text-danger'}`}>
									<div>{emailState ?? 'N/A'}</div>
									<div className="font-weight-bold" hidden={!!isValidEmail}>
										{intl.formatMessage({ id: 'page.body.plugins.wallet.fiat.withdraw.input.invalid.email' })}
									</div>
								</td>
							</tr>
							<hr />
							<tr className="py-2">
								<td>{intl.formatMessage({ id: 'page.body.history.deposit.header.amount' })}:</td>
								<td className="text-right">
									{amountState} {_toUpper(currency_id)}
								</td>
							</tr>
							<hr />
							<tr className="py-2">
								<td>{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' })}:</td>
								<td className="text-right">
									{_toNumber(currency?.withdraw_fee)} {_toUpper(currency_id)}
								</td>
							</tr>
							<hr />
							<tr className="py-2">
								<td>{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' })}:</td>
								<td className="text-right">
									{total} {_toUpper(currency_id)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="d-flex justify-content-center">
					<button
						disabled={!isValidEmail || !(currency && currency.withdrawal_enabled)}
						className={`btn p-3 btn-primary`}
						onClick={handleCreateWithdraw}
					>
						{intl.formatMessage({ id: 'page.body.plugins.wallet.fiat.withdraw.submit' })}
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="desktop-paypal-withdraw container">
			<div className="row">
				<div className="col-12">
					<div className="d-flex justify-content-center">
						<img src={PaypalLogo} alt="paypal" width="300px" />
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="amount-box mt-3">
						<input
							disabled={!(currency && currency.withdrawal_enabled)}
							value={emailState}
							onChange={e => setEmailState(e.target.value)}
							type="text"
							placeholder={intl.formatMessage({ id: 'page.body.plugins.wallet.fiat.withdraw.input.enter.email' })}
							autoFocus
						/>
						<span hidden={emailState === '' || isValidEmail} className="text-danger">
							Wrong email
						</span>
					</div>
				</div>
				<div className="col-12"></div>
			</div>
			<div className="row mt-3">
				<div className="col-12">
					<div className="amount-box mt-3">
						<input
							value={amountState}
							onChange={e => {
								const amount = _toNumber(e.target.value);
								if (amount >= 0 && amount <= _toNumber(wallet?.balance)) {
									setAmountState(_toString(amount));
								}
							}}
							type="text"
							placeholder="0"
						/>
						<span>{_toUpper(currency_id)}</span>
					</div>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-12">
					<div className="amount-box mt-3">
						<input
							value={otpState}
							onChange={e => {
								const otp = e.target.value;
								if (_toNumber(otp) >= 0 && otp.length <= 6) {
									setOtpState(otp);
								}
							}}
							type="text"
							placeholder={intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.title' })}
						/>
						<span className="text-uppercase">
							{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' })}
						</span>
					</div>
				</div>
			</div>
			<div className="mt-5">
				<table className="w-100">
					<tbody>
						<tr>
							<td>
								<h5 className="font-weight-bold">
									{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' })}:
								</h5>
							</td>
							<td className="text-right">
								<h5>
									{_toNumber(currency?.withdraw_fee)} {_toUpper(currency_id)}
								</h5>
							</td>
						</tr>
						<tr>
							<td>
								<h5 className="font-weight-bold">
									{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' })}:
								</h5>
							</td>
							<td className="text-right">
								<h5>
									{total} {_toUpper(currency_id)}
								</h5>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="row mt-3">
				<div className="col-12">
					<div className="mt-3 d-flex justify-content-center">
						<button
							className="btn btn-primary px-5 py-3"
							disabled={
								!amountState ||
								!emailState ||
								!currency?.withdraw_fee ||
								!(currency && currency.withdrawal_enabled) ||
								!otpState ||
								isLimitWithdraw24h
							}
							onClick={() => {
								setShowWithdrawConfirmState(true);
							}}
						>
							{isLimitWithdraw24h
								? 'Withdraw Limited'
								: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' })}
						</button>
					</div>
				</div>
			</div>
			<NewModal
				show={isShowWithdrawConfirmState}
				onHide={() => setShowWithdrawConfirmState(false)}
				titleModal={intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' })}
				bodyModal={renderModalBody()}
			/>
		</div>
	);
};
