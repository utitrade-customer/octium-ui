import React from 'react';
import _toNumber from 'lodash/toNumber';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';
import _toString from 'lodash/toString';

import LightIcon from 'assets/icons/light.svg';

interface BankWithdrawSummaryProps {
	currency_id: string;
}

export const BankWithdrawSummary = (props: BankWithdrawSummaryProps) => {
	return (
		<div>
			<div className="desktop-bank-withdraw-summary">
				<div className="d-flex align-items-center mb-4">
					<img src={LightIcon} style={{ width: 20, marginBottom: 1 }} />
					<span className="ml-2 mt-1">Withdraw Notice: </span>
				</div>
				<div className="ml-2 mt-2 desktop-bank-deposit-info-tip__list">
					<p>
						1. If you have deposited, please pay attention to the text messages, site letters and emails we send to
						you.
					</p>
					<p>
						2. Until 2 comfirmations are made, an equivalent amount of your assets will be temporarily unavailable for
						withdrawals.
					</p>
				</div>
			</div>
		</div>
	);
};
