import { bankDepositHistoryListFetch } from 'modules/plugins/fiat/bank/actions/bankDepositActions';
import { selectBankDepositHistoryList } from 'modules/plugins/fiat/bank/selectors';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { localeDate } from '../../../../../helpers';
import { reduce } from 'lodash';
import { BankHistoryTable } from '../HistoryTable';
import { selectCurrencies } from 'modules';
import _toLower from 'lodash/toLower';
import _find from 'lodash/find';

interface BankDepositHistoryProps {
	currency_id: string;
}
export const BankDepositHistory: React.FC<BankDepositHistoryProps> = (props: BankDepositHistoryProps) => {
	const intl = useIntl();
	const { currency_id } = props;

	// store
	const bankDepositHistoryList = useSelector(selectBankDepositHistoryList);
	const currencies = useSelector(selectCurrencies);

	// dispatch
	const dispatch = useDispatch();
	const currency = _find(currencies, { id: _toLower(currency_id) });

	React.useEffect(() => {
		dispatch(bankDepositHistoryListFetch());
	}, []);

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.date` }),
				accessor: 'date',
			},

			{
				Header: 'Txid Address',
				accessor: 'txid',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.status` }),
				accessor: 'state',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.amount` }),
				accessor: 'amount',
			},
		];
	}, [intl]);

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
			pending: <img src={process} alt="" />,
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

	const fiatDepositHistoriesData = reduce(
		bankDepositHistoryList,
		(result: {}[], value) => {
			result.push({
				date: localeDate(value.created_at, 'fullDate'),
				status: 'success',
				amount: Number(value.amount).toFixed(Number(currency?.precision)),
				txid: <span className="text-primary">{value.txid}</span>,
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
			<BankHistoryTable columns={columns} data={fiatDepositHistoriesData} />
		</div>
	);
};
