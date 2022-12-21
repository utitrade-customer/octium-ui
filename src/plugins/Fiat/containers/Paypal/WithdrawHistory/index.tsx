import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { localeDate } from '../../../../../helpers';
import { PaypalHistoryTable } from '../HistoryTable';
import { selectPaypalWithdrawHistoryData } from 'modules/plugins/fiat/paypal';
import _map from 'lodash/map';
import _toNumber from 'lodash/toNumber';

interface PaypalWithdrawHistoryProps {
	currency_id: string;
}

export const PaypalWithdrawHistory: React.FC<PaypalWithdrawHistoryProps> = (props: PaypalWithdrawHistoryProps) => {
	const intl = useIntl();

	// props

	// selector
	const paypalWithdrawHistories = useSelector(selectPaypalWithdrawHistoryData);

	const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('../../../../../assets/status/wait.svg');
		const fail = require('../../../../../assets/status/fail.svg');
		const success = require('../../../../../assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="succeed" />,
			failed: <img src={fail} alt="failed" />,
			accepted: <img src={process} alt="accepted" />,
			pending: <img src={process} alt="pending" />,
			collected: <img src={success} alt="collected" />,
			canceled: <img src={fail} alt="canceled" />,
			rejected: <img src={fail} alt="rejected" />,
			processing: <img src={process} alt="processing" />,
			prepared: <img src={process} alt="prepared" />,
			fee_processing: <img src={process} alt="fee_processing" />,
			skipped: <img src={success} alt="skipped" />,
			submitted:
				confirmations !== undefined && minConfirmations !== undefined ? (
					`${confirmations}/${minConfirmations}`
				) : (
					<img src={process} alt="submitted" />
				),
		};

		return statusMapping[tx];
	};

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.date` }),
				accessor: 'date',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.type` }),
				accessor: 'type',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.email` }),
				accessor: 'email',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.txid` }),
				accessor: 'txid',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.amount` }),
				accessor: 'amount',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.status` }),
				accessor: 'state',
			},
		];
	}, [intl]);

	const paypalWithdrawHistoriesData = _map(paypalWithdrawHistories, history => ({
		...history,
		date: localeDate(history.created_at, 'fullDate'),
		amount: _toNumber(history.amount).toFixed(6),
		txid: (
			<a rel="noopener noreferrer" target="_blank" href={history.txid}>
				{history.txid ?? 'N/A'}
			</a>
		),
		type: 'FIAT',
		state: formatTxState(history.aasm_state),
	}));

	return (
		<div style={{ marginTop: '10px' }}>
			<h2>{intl.formatMessage({ id: `page.body.history.withdraw` })}</h2>
			<PaypalHistoryTable columns={columns} data={paypalWithdrawHistoriesData} />
		</div>
	);
};
