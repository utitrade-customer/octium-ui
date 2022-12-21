import { CurrencyIcon } from 'components/CurrencyIcon';
import { Currency } from 'modules';
import { formatNumberP2p } from 'plugins/P2p/helper';
import { useP2PValueBalances } from 'plugins/P2p/hooks';
import React from 'react';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';

interface IEstimatedP2pValue {
	currencies: Currency[];
}

export const EstimatedP2pValue = (props: IEstimatedP2pValue) => {
	const { currencies } = props;
	const { totalBTC, totalUsd } = useP2PValueBalances();

	const currency = (name: string) =>
		currencies.find((currency: Currency) => currency.id === name.toLocaleLowerCase()) || {
			name: '',
		};

	const RenderSecondaryCurrencyValuation = () => {
		if (VALUATION_SECONDARY_CURRENCY) {
			return (
				<>
					<div className="value-container d-flex flex-row align-items-center">
						<div>
							<CurrencyIcon
								style={{ borderRadius: '50%' }}
								width="50px"
								height="50px"
								currency_id={VALUATION_SECONDARY_CURRENCY}
								alt={VALUATION_SECONDARY_CURRENCY}
							/>
						</div>
						<div className="ml-3">
							<div>{currency(VALUATION_SECONDARY_CURRENCY).name}</div>
							<div>
								<span className="value">{formatNumberP2p(totalUsd, 6)}</span>
								<span className="value-sign ml-3">{VALUATION_SECONDARY_CURRENCY}</span>
							</div>
						</div>
					</div>
				</>
			);
		}

		return null;
	};

	return (
		<>
			<div className="value-container d-flex flex-row align-items-center">
				<div>
					<CurrencyIcon
						style={{ borderRadius: '50%' }}
						width="50px"
						height="50px"
						currency_id={VALUATION_PRIMARY_CURRENCY}
						alt={VALUATION_PRIMARY_CURRENCY}
					/>
				</div>
				<div className="ml-3">
					<div>{currency(VALUATION_PRIMARY_CURRENCY).name}</div>
					<div>
						<span className="value">{formatNumberP2p(totalBTC, 6)}</span>
						<span className="value-sign ml-3">{VALUATION_PRIMARY_CURRENCY}</span>
					</div>
				</div>
			</div>

			<RenderSecondaryCurrencyValuation />
		</>
	);
};
