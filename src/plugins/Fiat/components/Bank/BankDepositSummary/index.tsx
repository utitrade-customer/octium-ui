import React from 'react';
import _toNumber from 'lodash/toNumber';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';

import LightIcon from 'assets/icons/light.svg';

interface BankDepositSummaryProps {
	currency_id: string;
}

export const BankDepositSummary = (props: BankDepositSummaryProps) => {
	return (
		<div className="desktop-bank-deposit-info-tip">
			<div className="d-flex align-items-center mb-4">
				<img src={LightIcon} style={{ width: 20, marginBottom: 1 }} />
				<span className="ml-2 mt-1">Deposit Notice: </span>
			</div>
			<div className="ml-2 mt-2 desktop-bank-deposit-info-tip__list">
				<p>
					1. If you have deposited, please pay attention to the text messages, site letters and emails we send to you.
				</p>
				<p>
					2. Until 2 comfirmations are made, an equivalent amount of your assets will be temporarily unavailable for
					deposits.
				</p>
			</div>
		</div>
	);
};
