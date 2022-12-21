import * as React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { setDocumentTitle } from '../../../helpers';
import { PaypalWithdrawScreen } from './Paypal/PaypalWithdrawScreen';
import _toLower from 'lodash/toLower';
import { useDispatch } from 'react-redux';
import { currenciesFetch } from 'modules';
import { BankWithdrawScreen } from './Bank/BankWithdrawScreen';

export const FiatWithdrawScreen = () => {
	const { currency_id } = useParams<{ currency_id: string }>();

	// dispatch
	const dispatch = useDispatch();

	// intl
	const intl = useIntl();

	setDocumentTitle(intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' }));

	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, []);

	switch (_toLower(currency_id)) {
		case 'paypal':
			return <PaypalWithdrawScreen currency_id={_toLower(currency_id)} />;
		case 'inr':
			return <BankWithdrawScreen currency_id={_toLower(currency_id)} />;
		default:
			return null;
	}
};
