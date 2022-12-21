import React from 'react';
import { formatNumber } from 'helpers';
import { selectCurrencies, selectWithdrawLimitRemains } from 'modules';
import { useSelector } from 'react-redux';
import _toNumber from 'lodash/toNumber';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';
import _toString from 'lodash/toString';
interface PaypalWithdrawSummaryProps {
	currency_id: string;
}

export const PaypalWithdrawSummary = (props: PaypalWithdrawSummaryProps) => {
	const { currency_id } = props;

	// selectors
	const currencies = useSelector(selectCurrencies);
	const {
		payload: { remains, limit },
	} = useSelector(selectWithdrawLimitRemains);

	// const isLimitWithdraw24h = Number(remains) === 0;

	const { min_withdraw_amount: minWithdrawAmount, precision } = _find(currencies, { id: _toLower(currency_id) }) || {
		min_withdraw_amount: null,
	};
	return (
		<div>
			<div className="desktop-paypal-withdraw-summary">
				<div className="desktop-paypal-withdraw-summary__right">
					<p>
						<span>1. Min Withdraw: </span>
						<span>{`${_toNumber(minWithdrawAmount).toFixed(precision)} ${_toUpper(currency_id)}`}</span>
					</p>
					<p>
						<span>2. Withdraw Remains: </span>
						<span>
							{`${formatNumber(_toString(remains.toFixed(precision)))} / `}
							<span
								style={{
									color: 'var(--blue)',
								}}
							>
								{`${formatNumber(_toString(limit))} USDT`}
							</span>
						</span>
					</p>
					<p>
						<span>
							3. Please withdrawal to your personal wallet address directly. Remember not to withdrawal to ICO's
							address, smart contract address, otherwise it may result the loss of assets.
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};
