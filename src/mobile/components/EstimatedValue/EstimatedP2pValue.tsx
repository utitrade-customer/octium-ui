import NP from 'number-precision';
import { formatNumberP2p } from 'plugins/P2p/helper';
import { useP2PValueBalances } from 'plugins/P2p/hooks';
import React from 'react';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
NP.enableBoundaryChecking(false); // default param is true

export const EstimatedP2pValue = () => {
	const { totalBTC, totalUsd } = useP2PValueBalances();

	return (
		<div className="td-mobile-cpn-estimated-value__body">
			<div className="td-mobile-cpn-estimated-value__body-wrap">
				<span className="td-mobile-cpn-estimated-value__body-number">{formatNumberP2p(totalBTC, 6)}</span>
				<span className="td-mobile-cpn-estimated-value__body-currency">{VALUATION_PRIMARY_CURRENCY.toUpperCase()}</span>
			</div>
			<div className="td-mobile-cpn-estimated-value__body-wrap">
				<span className="td-mobile-cpn-estimated-value__body-number">{formatNumberP2p(totalUsd, 6)}</span>
				<span className="td-mobile-cpn-estimated-value__body-currency">{VALUATION_SECONDARY_CURRENCY.toUpperCase()}</span>
			</div>
		</div>
	);
};
