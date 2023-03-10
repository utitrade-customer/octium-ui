import { GoBackIcon } from 'mobile/assets/icons/GoBackIcon';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'components/Link';
import _toLower from 'lodash/toLower';
import { BankDepositScreen } from './Bank';

export const FiatDepositMobileScreen = () => {
	const history = useHistory();

	const { currency_id } = useParams<{ currency_id: string }>();

	const renderBody = () => {
		switch (_toLower(currency_id)) {
			case 'inr':
				return <BankDepositScreen currency_id={_toLower(currency_id)} />;

			default:
				return (
					<div>
						<h1>Coming Soon</h1>
					</div>
				);
		}
	};
	return (
		<div className="td-mobile-wallet-fiat">
			<div className="td-mobile-wallet-fiat__header">
				<GoBackIcon className="td-mobile-wallet-fiat__header__goback" onClick={() => history.goBack()} />
				<h3 className="td-mobile-wallet-fiat__header__title">Deposit</h3>
				<Link className="td-mobile-wallet-fiat__header__history" to={`/wallets/history`}>
					History
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M18 7.12H11.22L13.96 4.3C11.23 1.6 6.81 1.5 4.08 4.2C1.35 6.91 1.35 11.28 4.08 13.99C6.81 16.7 11.23 16.7 13.96 13.99C15.32 12.65 16 11.08 16 9.1H18C18 11.08 17.12 13.65 15.36 15.39C11.85 18.87 6.15 18.87 2.64 15.39C-0.859996 11.92 -0.889996 6.28 2.62 2.81C6.13 -0.66 11.76 -0.66 15.27 2.81L18 0V7.12ZM9.5 5V9.25L13 11.33L12.28 12.54L8 10V5H9.5Z"
							fill="black"
						/>
					</svg>
				</Link>
			</div>
			{renderBody()}
		</div>
	);
};
