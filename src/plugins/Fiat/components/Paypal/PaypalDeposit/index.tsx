import React from 'react';
import { selectCurrencies } from 'modules';
import {
	selectPaypalRecentDepositData,
	createPaypalDeposit,
	PaypalType,
	getRecentPaypalDeposit,
} from 'modules/plugins/fiat/paypal';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import _toNumber from 'lodash/toNumber';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';
interface PaypalDepositProps {
	currency_id: string;
}

export const PaypalDeposit = (props: PaypalDepositProps) => {
	// intl
	const intl = useIntl();

	// props
	const { currency_id } = props;

	// selectors
	const recentDeposit = useSelector(selectPaypalRecentDepositData);
	const currencies = useSelector(selectCurrencies);

	// dispatch
	const dispatch = useDispatch();

	// state
	const [amountPaypalDepositState, setAmountPaypalDepositState] = React.useState('');

	const currency = _find(currencies, { id: _toLower(currency_id) });

	const handlePurchasePaypal = () => {
		if (_toNumber(amountPaypalDepositState) > 0) {
			dispatch(
				createPaypalDeposit({
					currency_id: _toLower(currency_id),
					amount: _toNumber(amountPaypalDepositState),
					type: PaypalType.Paypal,
				}),
			);
		}

		setAmountPaypalDepositState('');
	};

	const handleGetRecentPaypalDeposit = () => {
		dispatch(getRecentPaypalDeposit({ currency_id: _toLower(currency_id) }));
	};
	// side-effects
	React.useEffect(() => {
		const id = setInterval(() => {
			handleGetRecentPaypalDeposit();
		}, 5000);
		return () => clearInterval(id);
	}, []);

	const renderCreatePaypalDeposit = () => {
		return (
			<div>
				<div className="d-flex justify-content-center">
					<img
						src="https://img.choice.com.au/-/media/c60dd4cd19984993b549ad9ec22813d8.ashx"
						alt="paypal"
						width="300px"
					/>
				</div>
				<div className="desktop-paypal-deposit__amount-box mt-3">
					<input
						type="text"
						placeholder="0"
						disabled={!(currency && currency.deposit_enabled)}
						value={amountPaypalDepositState}
						onChange={e => {
							const amount = e.target.value;
							if (Number(amount) >= 0) {
								setAmountPaypalDepositState(amount);
							}
						}}
					/>
					<span>{_toUpper(currency_id)}</span>
				</div>
				<div className="mt-3 d-flex justify-content-center">
					<button
						disabled={!amountPaypalDepositState || !(currency && currency.deposit_enabled)}
						className="btn btn-primary px-5 py-3"
						onClick={handlePurchasePaypal}
					>
						{intl.formatMessage({ id: 'page.body.plugins.wallet.fiat.deposit.pay.with.paypal.button' })}
					</button>
				</div>
			</div>
		);
	};

	const renderProcessing = () => {
		return (
			<div className="mt-3">
				<div className="d-flex justify-content-center mt-3">
					<table cellPadding={10} cellSpacing={0}>
						<tbody>
							<tr>
								<td align="center" />
							</tr>
							<tr>
								<td align="center">
									<a
										target="_blank"
										href={`${recentDeposit.payment_link}`}
										title="How PayPal Works"
										rel="noopener noreferrer"
									>
										<img
											src="https://www.paypalobjects.com/webstatic/en_AU/i/buttons/btn_paywith_primary_l.png"
											alt="Pay with PayPal | Large"
										/>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	return (
		<div className="desktop-paypal-deposit">
			{recentDeposit.state === 'processing' && recentDeposit.remain_minutes !== 0
				? renderProcessing()
				: renderCreatePaypalDeposit()}
		</div>
	);
};
