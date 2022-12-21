import * as React from 'react';
import { useIntl } from 'react-intl';
import { BankHistoryTable } from '../HistoryTable';
import _map from 'lodash/map';
import _toNumber from 'lodash/toNumber';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrencies } from 'modules';
import { selectBankWithdrawHistoryList } from 'modules/plugins/fiat/bank/selectors';
import _toLower from 'lodash/toLower';
import _find from 'lodash/find';
import { bankWithdrawHistoryListFetch } from 'modules/plugins/fiat/bank/actions/bankWithdrawActions';
import reduce from 'lodash/reduce';
import { localeDate } from 'helpers/localeDate';

interface BankWithdrawHistoryProps {
	currency_id: string;
}

export const BankWithdrawHistory: React.FC<BankWithdrawHistoryProps> = (props: BankWithdrawHistoryProps) => {
	const intl = useIntl();
	const { currency_id } = props;

	// store
	const bankWithdrawHistoryList = useSelector(selectBankWithdrawHistoryList);
	const currencies = useSelector(selectCurrencies);

	// dispatch
	const dispatch = useDispatch();
	const currency = _find(currencies, { id: _toLower(currency_id) });

	React.useEffect(() => {
		dispatch(bankWithdrawHistoryListFetch());
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
		bankWithdrawHistoryList,
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
			<h2>{intl.formatMessage({ id: `page.body.history.withdraw` })}</h2>
			<BankHistoryTable columns={columns} data={fiatDepositHistoriesData} />
		</div>
	);
};
