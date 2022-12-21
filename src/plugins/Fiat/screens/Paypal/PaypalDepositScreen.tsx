import { getPaypalDepositHistory } from 'modules/plugins/fiat/paypal';
import { PaypalDepositInfo, PaypalDeposit, PaypalDepositHistory } from 'plugins/Fiat';
import { PaypalDepositSummary } from 'plugins/Fiat/components/Paypal/PaypalDepositSummary';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
interface PaypalDepositScreenProps {
	currency_id: string;
}
export const PaypalDepositScreen = (props: PaypalDepositScreenProps) => {
	const { currency_id } = props;
	// dispatch
	const dispatch = useDispatch();

	// history
	const history = useHistory();

	const dispatchFetchPaypalDepositHistory = React.useCallback(
		() => dispatch(getPaypalDepositHistory({ currency_id: currency_id })),
		[dispatch],
	);

	useEffect(() => {
		dispatchFetchPaypalDepositHistory();
	}, []);

	return (
		<div className="container-fluid mt-3" id="deposit-screen">
			<div className="d-flex flex-wrap deposit-container">
				<div className="col-md-6 p-0 d-flex flex-column justify-content-between">
					<PaypalDepositInfo currency_id={currency_id} />
					<PaypalDepositSummary currency_id={currency_id} />
				</div>
				<div className="col-md-6 p-0 deposit-container__address">
					<PaypalDeposit currency_id={currency_id} />
				</div>
			</div>
			<div className="row mt-5 deposit-history">
				<div className="col-12">
					<PaypalDepositHistory currency_id={currency_id} />
				</div>
			</div>
			<div style={{ position: 'fixed', top: '10%', left: '2rem' }}>
				<img
					style={{ cursor: 'pointer' }}
					src="https://img.icons8.com/fluent/48/000000/circled-left.png"
					onClick={() => history.push({ pathname: '/wallets' })}
					alt="Back"
				/>
			</div>
		</div>
	);
};
