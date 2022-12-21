import { BankWithdraw, BankWithdrawSummary } from 'plugins/Fiat/components/Bank';
import { BankWithdrawHistory, BankWithdrawInfo } from 'plugins/Fiat/containers/Bank';
import React from 'react';
import { useHistory } from 'react-router';
interface PaypalScreenProps {
	currency_id: string;
}
export const BankWithdrawScreen = (props: PaypalScreenProps) => {
	const { currency_id } = props;
	const history = useHistory();

	// dispatch
	// const dispatch = useDispatch();

	// // effects
	// React.useEffect(() => {
	// 	dispatch(getBankWithdrawHistory({ currency_id: currency_id }));
	// }, []);

	return (
		<div className="container-fluid mt-3" id="withdraw-screen">
			<div className="d-flex flex-wrap withdraw-container">
				<div className="col-md-6 p-0 d-flex flex-column justify-content-evenly">
					<BankWithdrawInfo currency_id={currency_id} />
					<hr className="solid" style={{ background: 'rgb(var(--rgb-alto))', width: '90%' }} />
					<BankWithdrawSummary currency_id={currency_id} />
				</div>
				<div className="col-md-6 p-0 withdraw-container__address">
					<BankWithdraw currency_id={currency_id} />
				</div>
			</div>
			<div className="row mt-5">
				<div className="col-12">
					<BankWithdrawHistory currency_id={currency_id} />
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
