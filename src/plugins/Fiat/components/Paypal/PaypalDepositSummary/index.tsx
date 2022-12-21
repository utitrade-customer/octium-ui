import React from 'react';
import { selectCurrencies } from 'modules';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import _toNumber from 'lodash/toNumber';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';
interface PaypalDepositSummaryProps {
	currency_id: string;
}

export const PaypalDepositSummary = (props: PaypalDepositSummaryProps) => {
	const intl = useIntl();

	// props
	const { currency_id } = props;

	// selectors
	const currencies = useSelector(selectCurrencies);

	const currency = _find(currencies, { id: _toLower(currency_id) }) || {
		name: '',
		min_confirmations: undefined,
		min_deposit_amount: undefined,
		deposit_fee: undefined,
		deposit_enabled: false,
		precision: 6,
	};

	const textConfirmation = intl.formatMessage(
		{ id: 'page.body.wallets.tabs.deposit.ccy.message.confirmation' },
		{ confirmations: currency.min_confirmations },
	);

	const textMinDeposit = `${intl.formatMessage(
		{ id: 'page.body.wallets.tabs.deposit.ccy.message.mindeposit' },
		{
			min_deposit_amount: _toNumber(currency.min_deposit_amount).toFixed(currency.precision) ?? 'Unavailble',
			currency: _toUpper(currency_id),
		},
	)}`;

	const textDepositFee = `${intl.formatMessage(
		{ id: 'page.body.wallets.tabs.deposit.ccy.message.depositfee' },
		{
			deposit_fee: _toNumber(currency.deposit_fee).toFixed(currency.precision) ?? 'Unavailble',
			currency: _toUpper(currency_id),
		},
	)}`;

	const textNote = `Only Deposit ${_toUpper(currency_id)} to this wallet.`;

	return (
		<div className="desktop-paypal-deposit-info-tip">
			<div className="d-flex align-items-center">
				<svg style={{ width: '20px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 4.791a.723.723 0 00.716-.729V2.729c0-.402-.32-.729-.716-.729a.723.723 0 00-.716.73v1.332c0 .402.32.73.716.73zM6.884 6.51a.713.713 0 01-.716.72.733.733 0 01-.508-.2l-.936-.94a.713.713 0 01-.212-.515c0-.197.076-.385.212-.515a.734.734 0 011.016 0l.932.934c.136.13.212.319.212.516zm4.436 14.032h1.336c.396 0 .716.326.716.729 0 .402-.32.729-.716.729h-1.332a.723.723 0 01-.716-.73c0-.38.32-.707.712-.729zM2.716 10.268h1.332c.388 0 .716.335.716.73 0 .401-.32.728-.716.728H2.716A.723.723 0 012 10.998c0-.394.328-.73.716-.73zm16.776-4.694a.696.696 0 00-.212-.511.701.701 0 00-1.02 0l-.932.934a.713.713 0 00-.212.516c0 .197.076.386.212.515.14.135.324.202.508.202a.719.719 0 00.508-.206l.932-.934a.73.73 0 00.216-.516zm.46 4.694h1.332c.388 0 .716.335.716.73 0 .401-.32.728-.716.728h-1.332a.723.723 0 01-.716-.729c0-.402.32-.73.716-.73zm-5.964 8.294h-3.976a.723.723 0 00-.716.73c0 .402.32.729.716.729h3.976a.723.723 0 00.716-.73c0-.402-.32-.729-.716-.729zM12 5.981c1.612 0 3.124.625 4.26 1.76A5.984 5.984 0 0118.024 12c0 1.61-.628 3.122-1.764 4.258a5.982 5.982 0 01-4.26 1.76 5.982 5.982 0 01-4.26-1.76A5.984 5.984 0 015.976 12c0-1.61.628-3.123 1.764-4.258A5.982 5.982 0 0112 5.982z"
						fill="currentColor"
					></path>
				</svg>
				<span className="ml-2">{intl.formatMessage({ id: 'page.body.wallet.tips' })}: </span>
			</div>
			<div className="ml-2 mt-2 desktop-paypal-deposit-info-tip__list">
				<p>{textConfirmation}</p>
				<p>{textMinDeposit}</p>
				<p>{textDepositFee}</p>
				<p className="textnote">
					<span className="textnote__text" style={{ fontWeight: 700 }}>
						{intl.formatMessage({ id: 'page.body.wallet.note' })}:
					</span>
					<span> {textNote}</span>
				</p>
			</div>
		</div>
	);
};
