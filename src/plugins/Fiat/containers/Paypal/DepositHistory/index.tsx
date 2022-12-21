import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { localeDate } from '../../../../../helpers';
import { reduce } from 'lodash';
import { PaypalHistoryTable } from '../HistoryTable';
import { selectPaypalDepositHistoryData } from 'modules/plugins/fiat/paypal';

interface PaypalDepositHistoryProps {
	currency_id: string;
}
export const PaypalDepositHistory: React.FC<PaypalDepositHistoryProps> = (props: PaypalDepositHistoryProps) => {
	const intl = useIntl();

	// props

	// selector
	const fiatDepositHistories = useSelector(selectPaypalDepositHistoryData);

	const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('../../../../../assets/status/wait.svg');
		const fail = require('../../../../../assets/status/fail.svg');
		const success = require('../../../../../assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="" />,
			failed: <img src={fail} alt="" />,
			accepted: <img src={process} alt="" />,
			collected: <img src={success} alt="" />,
			canceled: <img src={fail} alt="" />,
			rejected: <img src={fail} alt="" />,
			processing: <img src={process} alt="" />,
			prepared: <img src={process} alt="" />,
			fee_processing: <img src={process} alt="" />,
			skipped: <img src={success} alt="" />,
			submitted:
				confirmations !== undefined && minConfirmations !== undefined ? (
					`${confirmations}/${minConfirmations}`
				) : (
					<img src={process} alt="" />
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

	const fiatDepositHistoriesData = reduce(
		fiatDepositHistories,
		(result: {}[], value, key) => {
			result.push({
				date: localeDate(value.created_at, 'fullDate'),
				status: 'success',
				amount: value.amount,
				txid: <span className="text-primary">{value.payment_id}</span>,
				type: 'FIAT',
				state: formatTxState(value.state),
			});
			return result;
		},
		[],
	);

	return (
		<div style={{ marginTop: '10px' }}>
			<h2>{intl.formatMessage({ id: `page.body.history.deposit` })}</h2>
			<PaypalHistoryTable columns={columns} data={fiatDepositHistoriesData} />
		</div>
	);
};
